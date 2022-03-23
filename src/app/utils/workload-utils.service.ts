import { Injectable } from "@angular/core";
import { ConfigService } from "../services/config.service";

@Injectable({ providedIn: 'root' })
export class WorkloadUtilsService {

  constructor(private configSvc: ConfigService) {

  }

  public daysHoursStr(days: number, hours: number) {
    let dayWorkingHours = this.configSvc.dayWorkingHours;

    let totalHours = (days * dayWorkingHours) + hours;

    let parts = [];

    let fullMandays = Math.floor(totalHours / dayWorkingHours);
    if (fullMandays > 0) {
      parts.push(`${fullMandays} MD`);
    }

    let restManhours = (totalHours % dayWorkingHours);
    if (restManhours > 0) {
      parts.push(`${this.toFixedIfNecessary(restManhours.toString())} MH`);
    }

    return parts.join(' and ');
  }

  private toFixedIfNecessary(value: string){
    return +parseFloat(value).toFixed(1);
  }
}
