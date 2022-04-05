import { Moment } from 'moment';
import { WorkloadUtilsService } from 'src/app/utils/workload-utils.service';
import { sumBy } from 'lodash-es';
import { Day, Week } from './work-load-data-loader.service';
import { DateUtils } from 'src/app/utils/date-utils';


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
      dayStr: DateUtils.strFromDate(d),
      year: d.year(),
      dayOfWeek: DateUtils.getDayNo(d),
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
    this.weeks.push(nWeek);
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

      let day = this.getDay(currentDate);
      days.push(day);

      currentDate.add(1, 'day');
    }

    return days;
  }

}
