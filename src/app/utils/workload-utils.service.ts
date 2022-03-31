import { Injectable } from "@angular/core";
import { ConfigService } from "../services/config.service";

@Injectable({ providedIn: 'root' })
export class WorkloadUtilsService {

  constructor(private configSvc: ConfigService) {

  }

  private get dayWorkingHours() {
    return this.configSvc.dayWorkingHours;
  }

  public daysHoursStr(days: number, hours: number) {
    let totalHours = this.calcTotalHours(days, hours);

    let parts = [];

    let fullMandays = Math.floor(totalHours / this.dayWorkingHours);
    if (fullMandays > 0) {
      parts.push(`${fullMandays} MD`);
    }

    let restManhours = (totalHours % this.dayWorkingHours);
    if (restManhours > 0) {
      parts.push(`${this.toFixedIfNecessary(restManhours.toString())} MH`);
    }

    return parts.join(' and ');
  }

  public calcTotalHours(days: number, hours: number) {
    let safeDays = 0;
    let safeHours = 0;

    if (days) {
      safeDays = days;
    }

    if (hours) {
      safeHours = hours;
    }

    let totalHours = (safeDays * this.dayWorkingHours) + safeHours;
    return totalHours;
  }

  private toFixedIfNecessary(value: string){
    return +parseFloat(value).toFixed(1);
  }
}
