import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ConfigService } from 'src/app/services/config.service';
import { TaskTypeEnum } from 'src/app/api/task/task-ints';
import { WorkloadUtilsService } from 'src/app/utils/workload-utils.service';
import { AssignTaskEvents } from './assign-task-events';
// import { GenerateEventBlocks } from './generate-event-blocks';
import { TaskEntityOperations } from 'src/app/data/entity-operations';
import { UserService } from 'src/app/services/user.service';
import { TaskUtils } from 'src/app/services/task-utils';
import { TaskEntity } from 'src/app/data/entities/entities';
import { sumBy } from 'lodash-es';

@Injectable({ providedIn: 'root' })
export class WorkLoadDataLoaderService {
  constructor(
    private wlUtilsSvc: WorkloadUtilsService,
    private configSvc: ConfigService,
    private taskEntSvc: TaskEntityOperations,
    private userSvc: UserService
  ) { }

  private get dayWorkingHours() {
    return this.configSvc.dayWorkingHours;
  }

  public daysCompMgr: DaysManager;
  public daysProjectionMgr: DaysManager;

  public queryFrom: Moment;
  public queryTo: Moment;

  public weekSafeFrom: Moment;
  public weekSafeTo: Moment;

  public workingDaysCount = 0;

  public hoursPerDay = 8;

  public tasks: TaskEntity[];
  public usedDays: number[];

  //todo: asure these are UTC dates
  public loadData(usedDays: number[], queryFrom: Moment, queryTo: Moment) {
    this.daysCompMgr = new DaysManager(this.wlUtilsSvc);
    this.daysProjectionMgr = new DaysManager(this.wlUtilsSvc);

    this.workingDaysCount = usedDays.length;
    this.usedDays = usedDays;

    this.queryFrom = queryFrom;
    this.queryTo = queryTo;

    this.weekSafeFrom = queryFrom.startOf('month').startOf('week');
    this.weekSafeTo = queryTo.endOf('month').endOf('week');

    this.loadTasks();
    this.assignDataWorkLoad();
    this.createProjectionDays();

    this.daysProjectionMgr.projectLoad(this.usedDays.length, this.dayWorkingHours);

    // let ate = new AssignTaskEvents(this.response, this.days, this.weeks);
    // ate.assign();

    // let geb = new GenerateEventBlocks(this.days, this.weeks, this.response.tasks);
    // geb.assign();
  }

  private loadTasks() {
    let minMid = TaskUtils.MidFromDate(this.weekSafeFrom);
    let maxMid = TaskUtils.MidFromDate(this.weekSafeTo);

    let minWid = TaskUtils.WidFromDate(this.weekSafeFrom);
    let maxWid = TaskUtils.WidFromDate(this.weekSafeTo);

    //todo: fix id owner issue
    this.tasks = this.taskEntSvc.getByFilter(t =>
      t.owner_id === this.userSvc.id
      &&
      (
        t.mid >= minMid && t.mid <= maxMid
        ||
        t.wid >= minWid && t.wid <= maxWid
        ||
        (
          this.taskIntersectsWithWeekSafeRange(t.dateFrom)
          ||
          this.taskIntersectsWithWeekSafeRange(t.dateTo)
        )
      )
    );
  }

  private taskIntersectsWithWeekSafeRange(date: Moment) {
    let intersects = this.weekSafeFrom.isSameOrBefore(date) && this.weekSafeTo.isSameOrAfter(date);
    return intersects;
  }

  tady se to nejak blbe prirazuje
  private createProjectionDays() {
    let currentDate = this.weekSafeFrom.clone();
    while (currentDate.isSameOrBefore(this.weekSafeTo)) {
      let day = this.daysCompMgr.getDay(currentDate);
      if (day) {
        this.daysProjectionMgr.days.push(day);
        this.daysProjectionMgr.addDayToWeek(day);
      } else {
        this.daysProjectionMgr.addDay(currentDate.clone());
      }
      currentDate.add(1, 'day');
    }
  }

  private assignDataWorkLoad() {

    let from: Moment;
    let to: Moment;
    let usedDays: number[] = null;

    for (let task of this.tasks) {

      if (task.type === TaskTypeEnum.ExactFlexible) {
        from = task.dateFrom;
        to = task.dateTo;
      }

      if (task.type === TaskTypeEnum.ExactStatic) {
        from = task.dateFrom;
        to = task.dateTo;
      }

      if (task.type === TaskTypeEnum.Week) {
        //todo: assure this is monday
        from = moment().utc().year(task.year).isoWeek(task.week);
        to = from.endOf('week');
      }

      if (task.type == TaskTypeEnum.Month) {
        //todo: check month ok
        from = moment.utc().year(task.year).month(task.month).day(1);
        to = from.endOf('month');
      }

      let totalHours = this.wlUtilsSvc.calcTotalHours(task.manDays, task.manHours);

      let involvedDays = this.getDaysInPeriod(task.dateFrom, task.dateTo, usedDays);
      //todo: zero division check
      let hoursPerDay = totalHours / involvedDays.length;
      involvedDays.forEach(currentDay => {
        let day = this.daysCompMgr.getDaySafe(currentDay);
        this.addDayLoad(day, task, hoursPerDay);
      });
    }
  }

  private addDayLoad(day: Day, task: TaskEntity, hours: number) {

    if (!day) {
      console.error('should not be null');
      return;
    }

    let load: DayLoad = {
      hours,
      task
    };
    day.loads.push(load);
  }

  private getDaysInPeriod(from: Moment, to: Moment, usedDays: number[] = null) {

    let currentDate = from.clone();
    let days: Moment[] = [];

    while (currentDate.isSameOrBefore(to)) {

      let shouldAddDay = true;

      if (usedDays) {
        let dayNo = currentDate.isoWeekday();
        let isWorkingDay = this.usedDays.includes(dayNo);
        shouldAddDay = isWorkingDay;
      }

      if (shouldAddDay) {
        days.push(currentDate.clone());
      }

      currentDate.add(1, 'day');
    }
    return days;
  }

}

export class DaysManager {

  constructor(
    private wlUtilsSvc: WorkloadUtilsService
  ) {

  }

  public days: Day[] = [];
  public weeks: Week[] = [];

  public addDay(d: Moment) {

    let day: Day = {
      day: d,
      year: d.year(),
      dayOfWeek: d.day(),
      dayOfMonth: parseInt(d.format('D')),
      eventPositions: [],
      loads: []
    };
    this.days.push(day);

    this.addDayToWeek(day);

    return day;
  }

  public addDayToWeek(day: Day) {
    let yearWeekStr = day.day.format('GGGG,WW');
    let ywsPrms = yearWeekStr.split(',');
    let weekNo = parseInt(ywsPrms[1]);
    let year = parseInt(ywsPrms[0]);
    let week = this.getCurrentWeek(year, weekNo);
    week.days.push(day);
  }

  private getCurrentWeek(year: number, no: number) {

    let week = this.weeks.find((w) => { return w.no === no && w.year === year; });
    if (week) {
      return week;
    }

    let nWeek: Week = {
      year,
      no,
      days: [],

      eventBlocks: [],
      tasks: []
    };
    this.weeks.push(nWeek)
    return nWeek;
  }

  public getDay(day: Moment) {
    let d = this.days.find(d => d.day.isSame(day));
    return d;
  }

  public getDaySafe(day: Moment) {
    let d = this.getDay(day);

    if (!d) {
      d = this.addDay(day);
    }

    return d;
  }

  public projectLoad(
    workingDaysCount: number,
    dayWorkingHours: number
  ) {

    this.days.forEach(day => {
      day.totalHours = sumBy(day.loads, i => i.hours);
      //todo: busyIndex
      day.busyIndex = 0;
    });

    this.weeks.forEach(week => {
      week.totalHours = sumBy(week.days, i => i.totalHours);
      let hoursAday = week.totalHours / workingDaysCount / dayWorkingHours;
      week.workloadStr = this.wlUtilsSvc.daysHoursStr(0, week.totalHours);
      week.workloadDayStr = this.wlUtilsSvc.daysHoursStr(0, hoursAday);
    });

  }

  public getDaysInPeriod(from: Moment, to: Moment) {

    let currentDate = from.clone();
    let days: Day[] = [];

    while (currentDate.isSameOrBefore(to)) {

      let day = this.getDay(currentDate)
      days.push(day);

      currentDate.add(1, 'day');
    }

    return days;
  }

}

export interface EventPosition {
  position: number;
  taskId: string;
}

export interface TaskVM {
  id: string;
  name: string;
  type: TaskTypeEnum;
  month: number;
  week: number;
  year: number;
}

export interface EventBlock {
  position: number;
  bars: EventBar[];
}

export interface EventBar {
  name?: string;
  taskId?: string;
  days?: number;
  startDay?: Day;
  endDay?: Day;
  sd?: string;
  ed?: string;
}

export interface Week {
  year: number;
  no: number;
  days: Day[];
  tasks: TaskVM[];
  eventBlocks: EventBlock[];

  totalHours?: number;
  workloadStr?: string;
  workloadDayStr?: string;
}

export interface Day {
  day: Moment;
  dayOfWeek: number;
  dayOfMonth: number;
  year: number;
  loads: DayLoad[];
  eventPositions: EventPosition[];

  totalHours?: number;
  busyIndex?: number;
  color?: string;
}

export interface DayLoad {
  hours: number;
  task: TaskEntity;
}

export interface Month {
  year: number;
  no: number;
  title: string;
  totalHours: number;
  workingDays: number;
  workloadStr: string;

  weeks: Week[];
  tasks: TaskVM[];
}
