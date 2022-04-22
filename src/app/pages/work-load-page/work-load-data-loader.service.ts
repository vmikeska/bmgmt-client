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
import { DaysManager } from './days-manager';
import { DateUtils } from 'src/app/utils/date-utils';
import { GenerateEventBlocks } from './generate-event-blocks';

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

    this.weekSafeFrom = queryFrom.clone();
    this.weekSafeFrom.startOf('month').startOf('isoWeek');

    this.weekSafeTo = queryTo.clone();
    this.weekSafeTo.endOf('month').endOf('isoWeek');

    this.loadTasks();
    this.assignDataWorkLoad();
    this.createProjectionDays();

    this.daysProjectionMgr.projectLoad(this.usedDays.length, this.dayWorkingHours);

    let ate = new AssignTaskEvents(this.tasks, this.daysProjectionMgr.days, this.daysProjectionMgr.weeks);
    ate.assign();

    let geb = new GenerateEventBlocks(this.daysProjectionMgr.days, this.daysProjectionMgr.weeks, this.tasks);
    geb.assign();
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

    for (let task of this.tasks) {

      let usedDays: number[] = null;
      let from: Moment;
      let to: Moment;

      if (task.type === TaskTypeEnum.ExactFlexible) {
        from = task.dateFrom;
        to = task.dateTo;
        usedDays = this.usedDays;
      }

      if (task.type === TaskTypeEnum.ExactStatic) {
        from = task.dateFrom;
        to = task.dateTo;
      }

      if (task.type === TaskTypeEnum.Week) {
        from = DateUtils.mondayByWeekNo(task.year, task.week);
        to = DateUtils.endOfWeek(from);
        usedDays = this.usedDays;
      }

      if (task.type == TaskTypeEnum.Month) {
        //todo: check month ok
        from = DateUtils.parse(`${task.year}-${task.month}-1`);
        to = DateUtils.endOfMonth(from);
        usedDays = this.usedDays;
      }

      let totalHours = this.wlUtilsSvc.calcTotalHours(task.manDays, task.manHours);

      let involvedDays = this.getDaysInPeriod(from, to, usedDays);
      //todo: zero division check
      let hoursPerDay = totalHours / involvedDays.length;
      involvedDays.forEach(currentDay => {
        let day = this.daysCompMgr.getDaySafe(currentDay);
        this.addDayLoad(day, task, hoursPerDay);
      });
    }
  }

  private addDayLoad(day: Day, task: TaskEntity, hours: number) {

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
        let dayNo = DateUtils.getDayNo(currentDate);
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
  dayStr: string;
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
