import { Injectable } from "@angular/core";
import { Moment } from "moment";
import { TaskTypeEnum } from "src/app/api/task/task-ints";
import { TaskEntity } from "src/app/data/entities/entities";
import { TaskEntityOperations } from "src/app/data/entity-operations";
import { TaskUtils } from "src/app/services/task-utils";
import { UserService } from "../../services/user.service";
import { TaskDO } from "./task-model-ints";

@Injectable({ providedIn: 'root' })
export class TaskModelService {

  constructor(
    private userSvc: UserService,
    private taskEntSvc: TaskEntityOperations
  ) {

  }

  public createTask(d: TaskDO) {
    let e: TaskEntity =
    {
      owner_id: this.userSvc.id,
      name: d.name,
      type: d.type,
      manDays: d.manDays,
      manHours: d.manHours,
      desc: d.desc
    };

    if (d.type == TaskTypeEnum.Month) {
      e.month = d.month;
      e.year = d.year;
      e.mid = TaskUtils.MidFromMonth(d.year, d.month);
    }

    if (d.type == TaskTypeEnum.Week) {
      e.week = d.week;
      e.year = d.year;
      e.wid = TaskUtils.WidFromWeek(d.year, d.week);
    }

    if (
      d.type == TaskTypeEnum.ExactFlexible
      ||
      d.type == TaskTypeEnum.ExactStatic
    ) {
      e.dateFrom = d.dateFrom
      e.dateTo = d.dateTo
    }

    this.taskEntSvc.create(e);
    return e;
  }

  public updateTask(d: TaskDO) {

    let e = this.taskEntSvc.getById(d.id);

    e.type = d.type;
    e.manDays = d.manDays;
    e.manHours = e.manHours;

    e.dateFrom = null;
    e.dateTo = null;

    e.week = 0;
    e.year = 0;
    e.month = 0;
    e.mid = 0;
    e.wid = 0;

    if (e.type != TaskTypeEnum.Unassigned) {
      if (d.type == TaskTypeEnum.ExactFlexible || d.type == TaskTypeEnum.ExactStatic) {
        e.dateFrom = d.dateFrom;
        e.dateTo = d.dateTo;
      }

      if (d.type == TaskTypeEnum.Month) {
        e.month = d.month;
        e.year = d.year;
        e.mid = TaskUtils.MidFromMonth(d.year, d.month);
      }

      if (d.type == TaskTypeEnum.Week) {
        e.week = d.week;
        e.year = d.year;
        e.wid = TaskUtils.WidFromWeek(d.year, d.week);
      }
    }

    this.taskEntSvc.updateById(e);
  }
}





