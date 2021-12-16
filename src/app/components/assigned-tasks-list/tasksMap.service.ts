import { Injectable } from '@angular/core';
import { TaskResponse, TaskTypeEnum } from 'src/app/api/task/task-ints';
import { DateUtils } from 'src/app/utils/date-utils';
import { TaskItemVM } from '../comps-ints';

@Injectable({providedIn: 'root'})
export class TaskMapService {
  constructor() { }

  public mapTaskVM(r: TaskResponse) {
    let t: TaskItemVM = {
      res: r,
      name: r.name,
      load: `${r.manDays}d ${r.manHours}h`,
      date: ''
    };

    if (r.type === TaskTypeEnum.Month) {
      t.date = `${DateUtils.getMonthName(r.month)} ${r.year}`;
    }

    if (r.type === TaskTypeEnum.Week) {
      t.date = `${r.week}. week ${r.year}`;
    }

    if ([TaskTypeEnum.ExactFlexible, TaskTypeEnum.ExactStatic].includes(r.type)) {
      t.date = `${DateUtils.strFromStrDate(r.dateFrom)} - ${DateUtils.strFromStrDate(r.dateFrom)}`
    }

    return t;
  }

}
