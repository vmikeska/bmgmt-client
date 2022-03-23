import * as moment from "moment";

export class DateUtils {
  public static strFromStrDate(strDate: string) {
    let m = moment.utc(strDate);
    let str = m.format('DD.MM.YYYY');
    return str;
  }

  public static strFromDate(m: moment.Moment) {
    let str = m.format('DD.MM.YYYY');
    return str;
  }

  public static getMonthName(no: number) {
    let n = moment().month(no).format('MMMM');
    return n;
  }
}
