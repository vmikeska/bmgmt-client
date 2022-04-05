import * as moment from "moment";
import { Moment } from "moment";


export class DateUtils {
  public static strFromStrDate(strDate: string) {
    let m = moment.utc(strDate);
    let str = m.format('DD.MM.YYYY');
    return str;
  }

  public static parse(strDate: string) {
    let m = moment.utc(strDate, 'YYYY-M-D');
    return m;
  }

  public static strFromDate(m: Moment) {
    let str = m.format('DD.MM.YYYY');
    return str;
  }

  public static getMonthName(no: number) {
    let n = moment().month(no).format('MMMM');
    return n;
  }

  public static getDayNo(m: Moment) {
    let n = m.isoWeekday();
    if (n === 0) {
      return 7;
    }

    return n;
  }

  public static endOfWeek(m: Moment) {
    return m.clone().endOf('week').startOf('day');;
  }

  public static endOfMonth(m: Moment) {
    return m.clone().endOf('month').startOf('day');;
  }

  public static mondayByWeekNo(year: number, no: number) {
    let d = this.parse(`${year}-1-1`);

    //condition is just security
    while(d.year() === year) {

      if (d.isoWeek() === no) {
        return d;
      }

      d.add(1, 'day');
    }

    return null;
  }
}
