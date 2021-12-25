import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { DayFilterItem } from './work-load-page';

@Injectable({providedIn: 'root'})
export class WorkloadFilterService {
  constructor() { }

  private now = moment().utc();
  private firstDay = this.now.startOf('month');

  public from = this.firstDay.clone();
  //moment.utc(`2021-12-01`);
  public to = this.firstDay.clone().add(3, 'month');

  public get toDateMin() {
    return this.from;
  }

  public get fromDateMax() {
    return this.to;
  }

  private dispayDateFormat = 'DD.MM.YYYY';

  public filterDays: DayFilterItem[] = [
    {
      label: 'Monday',
      selected: true,
      no: 1
    },
    {
      label: 'Tuesday',
      selected: true,
      no: 2
    },
    {
      label: 'Wednesday',
      selected: true,
      no: 3
    },
    {
      label: 'Thursday',
      selected: true,
      no: 4
    },
    {
      label: 'Friday',
      selected: true,
      no: 5
    },
    {
      label: 'Saturday',
      selected: false,
      no: 6
    },
    {
      label: 'Sunday',
      selected: false,
      no: 7
    },
  ];

  public get displayDaysUsed() {
    let str = this.filterDays
    .filter(d => d.selected)
    .map(d => d.label.substring(0,3))
    .join(', ');
    return str;
  }

  public get displayDateFrom() {
    return this.from.format(this.dispayDateFormat);
  }

  public get displayDateTo() {
    return this.to.format(this.dispayDateFormat);
  }

}
