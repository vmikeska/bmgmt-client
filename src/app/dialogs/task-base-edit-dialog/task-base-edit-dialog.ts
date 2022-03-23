import { Component, Input, OnInit, Output } from '@angular/core';
import { faPlus, faSave, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { cloneDeep } from 'lodash-es';
import * as moment from 'moment';
import { Moment } from 'moment';
import { BehaviorSubject, Subject } from 'rxjs';
import { TaskTypeEnum } from 'src/app/api/task/task-ints';
import { TaskEntity } from 'src/app/data/entities/entities';
import { TaskEntityOperations } from 'src/app/data/entity-operations';
import { ItemOption } from 'src/app/ints/common-ints';
import { DialogService } from '../base/dialog.service';

@Component({
  selector: 'app-task-base-edit-dialog',
  templateUrl: 'task-base-edit-dialog.html',
  styleUrls: ['task-base-edit-dialog.scss']
})
export class TaskBaseEditDialogComponent implements OnInit {
  constructor(
    private dialogSvc: DialogService,
    private taskEntSvc: TaskEntityOperations
  ) { }

  @Input()
  public title: string;

  @Input()
  public id: string;

  @Input()
  public type: TaskTypeEnum;

  @Input()
  public mode: TaskEditTypeModeEnum;

  @Input()
  public week: number;

  @Input()
  public year: number;

  @Input()
  public month: number;

  @Input()
  public dateFrom: Moment;

  @Input()
  public dateTo: Moment;

  @Input()
  public manHours = 0;

  @Input()
  public manDays = 0;

  public name: string;


  faSave = faSave;
  faPlus = faPlus;

  public weekDisabled = false;
  public monthDisabled = false;
  public yearDisabled = false;

  public btnIco: IconDefinition;

  public te: TaskEntity;

  public ngOnInit() {

    this.te = this.taskEntSvc.getById(this.id);
    if (!this.te) {
      return;
    }

    let typeOptions = cloneDeep(this.allTypeOptions);

    if (this.mode === TaskEditTypeModeEnum.AddMonth) {
      this.type = TaskTypeEnum.Month;
      this.monthDisabled = true;
      this.yearDisabled = true;
    }

    if (this.mode === TaskEditTypeModeEnum.AddWeek) {
      this.type = TaskTypeEnum.Week;
      this.weekDisabled = true;
      this.yearDisabled = true;
      this.initWeeks(this.year);
    }

    if (this.mode === TaskEditTypeModeEnum.AddDay) {
      this.type = TaskTypeEnum.ExactStatic;

      typeOptions =
        this.allTypeOptions.filter(i => [TaskTypeEnum.ExactStatic, TaskTypeEnum.ExactFlexible].includes(i.value));
    }

    this.typeOptions.next(typeOptions);

    this.btnIco = this.mode === TaskEditTypeModeEnum.FullEdit ? faSave : faPlus;

    this.initYears();
    this.initMonths();

    if (this.isEdit) {
      this.initEditAsync();
    }
  }

  public get showName() {
    return this.mode !== TaskEditTypeModeEnum.FullEdit;
  }

  public get showType() {
    let t = TaskEditTypeModeEnum;
    return [t.AddDay, t.FullEdit].includes(this.mode);
  }

  private async initEditAsync() {
    this.name = this.te.name;
    this.type = this.te.type;
    this.manDays = this.te.manDays;
    this.manHours = this.te.manHours;

    if (this.te.type === TaskTypeEnum.Unassigned) {
      this.initUnassignedEdit();
    } else {
      this.initAssignedEdit();
    }

    this.initWeeks(this.year);
  }

  private initUnassignedEdit() {
    let now = moment().utc().startOf('d');
    let year = now.year();
    let week = now.isoWeek();
    let month = now.month() + 1;

    let dateFrom = now.clone();
    let dateTo = dateFrom.clone().add(2, 'd');

    this.week = week;
    this.month = month;
    this.year = year;
    this.dateFrom = dateFrom;
    this.dateTo = dateTo;
  }

  private initAssignedEdit() {
    let now = moment().utc().startOf('d');

    let dateFromDefault = now.clone();
    let dateToDefault = dateFromDefault.clone().add(2, 'd');

    let dateFrom = this.te.dateFrom;
    let dateTo = this.te.dateTo;

    this.week = this.te.week;
    this.month = this.te.month;
    this.year = this.te.year;
    this.dateFrom = dateFrom.isValid() ? dateFrom : dateFromDefault;
    this.dateTo = dateTo.isValid() ? dateTo : dateToDefault;
  }

  private get isEdit() {
    return !!this.id;
  }

  public get toDateMin() {
    return this.dateFrom;
  }

  public get fromDateMax() {
    return this.dateTo;
  }

  public yearsOptions = new BehaviorSubject<ItemOption[]>([]);
  public monthOptions = new BehaviorSubject<ItemOption[]>([]);
  public weekOptions = new BehaviorSubject<ItemOption[]>([]);

  public allTypeOptions: ItemOption[] = [
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
  ];

  public typeOptions = new BehaviorSubject<ItemOption[]>([]);

  @Output()
  public onSavedEvent = new Subject();

  public yearChange() {
    this.initWeeks(this.year);
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
    return [TaskTypeEnum.ExactFlexible, TaskTypeEnum.ExactStatic].includes(this.type);
  }

  public get isPeriodBased() {
    return [TaskTypeEnum.Month, TaskTypeEnum.Week].includes(this.type);
  }

  public get isMonthBased() {
    return TaskTypeEnum.Month === this.type;
  }

  public get isWeekBased() {
    return TaskTypeEnum.Week === this.type;
  }

  public updateClick() {
    this.sendDataAsync();
  }

  private async sendDataAsync() {
    let e: TaskEntity = {
      id: this.id,
      name: this.name,
      type: this.type,
      manDays: this.manDays,
      manHours: this.manHours,
      month: this.month,
      week: this.week,
      year: this.year,
      dateFrom: this.dateFrom,
      dateTo: this.dateTo
    };

    this.taskEntSvc.updateById(e)

    this.onSavedEvent.next();
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogSvc.destroy();
  }

}

export enum TaskEditTypeModeEnum { AddMonth, AddWeek, AddDay, FullEdit }

