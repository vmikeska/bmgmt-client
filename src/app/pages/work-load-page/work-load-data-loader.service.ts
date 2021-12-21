import { Injectable } from '@angular/core';
import { max } from 'lodash';
import * as moment from 'moment';
import { Moment } from 'moment';
import { ConfigLoaderService } from 'src/app/api/account/config-loader.service';
import { TaskBusynessApiService } from 'src/app/api/task/task-busyness-api.service';
import { TaskTypeEnum, WorkloadDayResponse, WorkloadRequest, WorkloadResponse } from 'src/app/api/task/task-ints';
import { ColorUtils } from 'src/app/utils/color-utils';
import { WorkloadUtilsService } from 'src/app/utils/workload-utils.service';
import { AssignTaskEvents } from './assign-task-events';
import { GenerateEventBlocks } from './generate-event-blocks';

@Injectable({ providedIn: 'root' })
export class WorkLoadDataLoaderService {
  constructor(
    private taskBusynessApiSvc: TaskBusynessApiService,
    private wlUtilsSvc: WorkloadUtilsService,
    private configSvc: ConfigLoaderService
  ) { }

  public response: WorkloadResponse;

  private get dayWorkingHours() {
    return this.configSvc.response.dayWorkingHours;
  }

  public weeks: Week[] = [];
  public days: Day[] = [];

  public minDay: Moment;
  public maxDay: Moment;

  public workingDaysCount = 0;

  public async loadDataAsync(req: WorkloadRequest) {
    this.workingDaysCount = req.useDays.length;

    await this.configSvc.getValueAsync();

    this.response = await this.taskBusynessApiSvc.getWorkloadPageData(req);

    this.generateTimerRange();

    let dr = this.response.dateRange;
    this.minDay = moment(dr.from);
    this.maxDay = moment(dr.to);

    let ate = new AssignTaskEvents(this.response, this.days, this.weeks);
    ate.assign();

    let geb = new GenerateEventBlocks(this.weeks, this.response.tasks);
    geb.assign();
  }

  private generateTimerRange() {

    this.days = [];
    this.weeks = [];

    this.response.days.forEach((d) => {
      let md = moment(d.date);
      this.addDay(md);
    })
  }

  private addDay(d: Moment) {
    let yearWeekStr = d.format('GGGG,WW');
    let ywsPrms = yearWeekStr.split(',');
    let weekNo = parseInt(ywsPrms[1]);
    let year = parseInt(ywsPrms[0]);
    let week = this.getCurrentWeek(year, weekNo);

    let rDay = this.response.days.find((res) => {
      let resDate = moment(res.date);
      let matches = resDate.isSame(d);
      return matches;
    });

    let day: Day = {
      day: d,
      year: d.year(),
      dayOfWeek: d.day(),
      dayOfMonth: parseInt(d.format('D')),
      response: rDay,
      eventPositions: []
    };

    if (rDay) {
      day.busyIndex = rDay.busyIndex;
      day.totalHours = rDay.totalHours;
      day.color = ColorUtils.getColor(rDay.busyIndex);
    }

    this.days.push(day);
    week.days.push(day);
  }

  private getCurrentWeek(year: number, no: number) {
    let week = this.weeks.find((w) => { return w.no === no && w.year === year; });
    if (week) {
      return week;
    }

    let rWeek = this.findWeekFromResponse(year, no);

    let hoursAday = rWeek.totalHours / this.workingDaysCount / this.dayWorkingHours;

    let nWeek: Week = {
      year,
      no,
      days: [],
      totalHours: rWeek.totalHours,
      workloadStr: this.wlUtilsSvc.daysHoursStr(0, rWeek.totalHours),
      workloadDayStr: this.wlUtilsSvc.daysHoursStr(0, hoursAday),
      eventBlocks: [],
      tasks: []
    };
    this.weeks.push(nWeek)
    return nWeek;
  }

  private findWeekFromResponse(year: number, no: number) {
    let week = this.response.weeks.find((w) => { return w.year === year && w.no == no; });
    return week;
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
  name: string;
  taskId: string;
  days: number;
}



export interface Week {
  year: number;
  no: number;
  days: Day[];
  totalHours: number;
  workloadStr: string;
  workloadDayStr: string;
  eventBlocks: EventBlock[];
  tasks: TaskVM[];
}

export interface Day {
  day: Moment;
  dayOfWeek: number;
  dayOfMonth: number;
  year: number;
  totalHours?: number;
  busyIndex?: number;
  color?: string;
  response?: WorkloadDayResponse;
  eventPositions: EventPosition[];
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
