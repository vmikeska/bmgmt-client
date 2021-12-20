import { Component, Input, OnInit, Output } from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';
import { TaskApiService } from 'src/app/api/task/task-api.service';
import { TaskDateTypeResponse, TaskResponse, TaskTypeEnum } from 'src/app/api/task/task-ints';
import { ItemOption } from 'src/app/ints/common-ints';
import { TaskDetailService } from 'src/app/services/task-detail.service';
import { UrlParamUtils } from 'src/lib/utils/url-utils';
import { DialogService } from '../base/dialog.service';

@Component({
  selector: 'app-task-base-edit-dialog',
  templateUrl: 'task-base-edit-dialog.html',
  styleUrls: ['task-base-edit-dialog.scss']
})
export class TaskBaseEditDialogComponent implements OnInit {
  constructor(
    public taskApiSvc: TaskApiService,
    // private taskDetailSvc: TaskDetailService,
    private dialogSvc: DialogService
  ) { }

  @Input()
  public taskId: string;

  faSave = faSave;

  public ngOnInit() {
    this.initYears();
    this.initMonths();

    if (this.isEdit) {
      this.initEditAsync();
    }
  }

  private async initEditAsync() {
    var res = await this.taskApiSvc.getById(this.taskId);

    this.vm = {
      id: res.id,
      name: res.name,
      type: res.type
    };

    if (res.type === TaskTypeEnum.Unassigned) {
      this.initUnassignedEdit();
    } else {
      this.initAssignedEdit(res);
    }

    this.initWeeks(this.vm.year);

    this.initialized = true;
  }

  private initUnassignedEdit() {
    let now = moment().utc().startOf('d');
    let year = now.year();
    let week = now.isoWeek();
    let month = now.month() + 1;

    let dateFrom = now.clone();
    let dateTo = dateFrom.clone().add(2, 'd');

    this.vm.manDays = 0;
    this.vm.manHours = 0;
    this.vm.week = week;
    this.vm.month = month;
    this.vm.year = year;
    this.vm.dateFrom = dateFrom;
    this.vm.dateTo = dateTo;
  }

  private initAssignedEdit(res: TaskResponse) {
    let now = moment().utc().startOf('d');

    let dateFromDefault = now.clone();
    let dateToDefault = dateFromDefault.clone().add(2, 'd');

    let dateFrom = moment.utc(res.dateFrom);
    let dateTo = moment.utc(res.dateTo);

    this.vm.manDays = res.manDays;
    this.vm.manHours = res.manHours;
    this.vm.week = res.week;
    this.vm.month = res.month;
    this.vm.year = res.year;
    this.vm.dateFrom = dateFrom.isValid() ? dateFrom : dateFromDefault;
    this.vm.dateTo = dateTo.isValid() ? dateTo : dateToDefault;
  }

  private get isEdit() {
    return !!this.taskId;
  }

  public initialized = false;

  public vm: TaskEditVM;

  public get toDateMin() {
    return this.vm.dateFrom;
  }

  public get fromDateMax() {
    return this.vm.dateTo;
  }

  public yearsOptions = new BehaviorSubject<ItemOption[]>([]);
  public monthOptions = new BehaviorSubject<ItemOption[]>([]);
  public weekOptions = new BehaviorSubject<ItemOption[]>([]);


  public typeOptions = new BehaviorSubject<ItemOption[]>([
    {
      label: 'Simple task',
      value: TaskTypeEnum.Unassigned
    },
    {
      label: 'Exact date range',
      value: TaskTypeEnum.ExactStatic
    },
    {
      label: 'Date range in working days',
      value: TaskTypeEnum.ExactFlexible
    },
    {
      label: 'Week',
      value: TaskTypeEnum.Week
    },
    {
      label: 'Month',
      value: TaskTypeEnum.Month
    },
  ]);

  @Output()
  public onSavedEvent = new Subject();

  public yearChange() {
    this.initWeeks(this.vm.year);
  }

  private initMonths() {
    let opts: ItemOption[] = [];
    for (let m = 1; m <= 12; m++) {
      let name = moment(m, 'M').format('MMMM');
      let month: ItemOption = { label: name.toString(), value: m };
      opts.push(month);
    }
    this.monthOptions.next(opts);
  }

  private initWeeks(year: number) {

    if (!year) {
      return;
    }

    let weeks = moment(`${year}-01-01`).locale('cs').isoWeeksInYear();

    let opts: ItemOption[] = [];
    for (let w = 1; w <= weeks; w++) {
      let week: ItemOption = { label: w.toString(), value: w };
      opts.push(week);
    }
    this.weekOptions.next(opts);
  }

  private initYears() {
    let thisYear = moment().year();
    let nextYearsCnt = 3;

    let opts: ItemOption[] = [];
    for (let y = thisYear; y <= thisYear + nextYearsCnt; y++) {
      let year: ItemOption = { label: y.toString(), value: y };
      opts.push(year);
    }
    this.yearsOptions.next(opts);
  }

  public get isDateRangeBased() {
    return [TaskTypeEnum.ExactFlexible, TaskTypeEnum.ExactStatic].includes(this.vm.type);
  }

  public get isPeriodBased() {
    return [TaskTypeEnum.Month, TaskTypeEnum.Week].includes(this.vm.type);
  }

  public get isMonthBased() {
    return TaskTypeEnum.Month === this.vm.type;
  }

  public get isWeekBased() {
    return TaskTypeEnum.Week === this.vm.type;
  }

  public updateClick() {
    this.updateTaskAsync();
  }

  private async updateTaskAsync() {
    let req: TaskDateTypeResponse = {
      id: this.vm.id,
      name: this.vm.name,
      type: this.vm.type,
      manDays: this.vm.manDays,
      manHours: this.vm.manHours,
      month: this.vm.month,
      week: this.vm.week,
      year: this.vm.year,
      dateFrom: this.vm.dateFrom.isValid() ? this.vm.dateFrom.format('YYYY-MM-DD') : null,
      dateTo: this.vm.dateTo.isValid() ? this.vm.dateTo.format('YYYY-MM-DD') : null
    };

    await this.taskApiSvc.updateType(req);
    this.onSavedEvent.next();
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogSvc.destroy();
  }

}

export enum TaskTypeEditEnum { AddFull, AddWeek, AddMonth, EditFull, }

export interface TaskEditVM {
  id: string;
  name: string;
  type: TaskTypeEnum;

  dateFrom?: Moment;
  dateTo?: Moment;
  week?: number;
  year?: number;
  month?: number;

  manHours?: number;
  manDays?: number;
}
