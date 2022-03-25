import { Injectable } from '@angular/core';
import { TaskTypeEnum } from 'src/app/api/task/task-ints';
import { TaskEntity } from 'src/app/data/entities/entities';
import { DateUtils } from 'src/app/utils/date-utils';
import { TaskItemVM } from '../comps-ints';

@Injectable({providedIn: 'root'})
export class TaskMapService {
  constructor() { }

  public mapTaskVM(r: TaskEntity) {
    let t: TaskItemVM = {
      id: r.id,
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
      t.date = `${DateUtils.strFromDate(r.dateFrom)} - ${DateUtils.strFromDate(r.dateFrom)}`
    }

    return t;
  }

}
