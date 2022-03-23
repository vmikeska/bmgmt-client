import * as moment from 'moment';
import { Moment } from 'moment';
import { TaskTypeEnum } from '../api/task/task-ints';
import { TaskEntity } from '../data/entities/entities';
import { DateUtils } from '../utils/date-utils';


export class TaskUtils {
  public static getTaskTypeDesc(t: TaskEntity) {
    if (t.type === TaskTypeEnum.Month) {
      let str = `${DateUtils.getMonthName(t.month)}, ${t.year}`;
      return str;
    }

    if (t.type === TaskTypeEnum.Week) {
      let date = moment().year(t.year).week(t.week).day('monday');
      let str = `${t.week}. Week, ${DateUtils.getMonthName(date.month())}, ${t.year}`;
      return str;
    }

    if (t.type === TaskTypeEnum.ExactFlexible) {
      let str = `Working days between ${DateUtils.strFromDate(t.dateFrom)} and ${DateUtils.strFromDate(t.dateTo)}`;
      return str;
    }

    if (t.type === TaskTypeEnum.ExactStatic) {
      let str = `All days between ${DateUtils.strFromDate(t.dateFrom)} and ${DateUtils.strFromDate(t.dateTo)}`;
      return str;
    }

    return '';
  }

  public static MidFromDate(d: Moment) {
    var id = (d.year() * 100) + d.month() + 1;
    return id;
  }

  public static WidFromDate(d: Moment) {
    var id = (d.year() * 100) + d.week();
    return id;
  }

  public static MidFromMonth(year: number, month: number) {
    var id = (year * 100) + month;
    return id;
  }

  public static WidFromWeek(year: number, week: number) {
    var id = (year * 100) + week;
    return id;
  }

}
