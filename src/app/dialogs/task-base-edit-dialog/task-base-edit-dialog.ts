import { Component, Input, OnInit, Output } from '@angular/core';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { Moment } from 'moment';
import { Subject } from 'rxjs';
import { TaskApiService } from 'src/app/api/task/task-api.service';
import { TaskResponse, TaskTypeEnum } from 'src/app/api/task/task-ints';
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
    private taskDetailSvc: TaskDetailService,
    private dialogSvc: DialogService
  ) { }

  @Input()
  public taskId: string;

  faSave = faSave;

  public get id() {
    let id = UrlParamUtils.getUrlParam<string>('id');
    return id;
  }

  public ngOnInit() {
    this.initYears();
    this.initMonths();

    this.initAsync();
  }

  public initialized = false;

  public vm: TaskEditVM;

  public get detailVM() {
    return this.taskDetailSvc.vm;
  }

  public yearsOptions: ItemOption[] = [];
  public monthOptions: ItemOption[] = [];
  public weekOptions: ItemOption[] = [];


  public typeOptions: ItemOption[] = [
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

  @Output()
  public onSavedEvent = new Subject();


  public taskTypeChange() {

  }

  public yearChange() {
    this.initWeeks(this.vm.year);
  }

  private initMonths() {
    for (let m = 1; m <= 12; m++) {
      let name = moment(m, 'M').format('MMMM');
      let month: ItemOption = { label: name.toString(), value: m };
      this.monthOptions.push(month);
    }
  }

  private initWeeks(year: number) {
    let weeks = moment(`${year}-01-01`).locale('cs').isoWeeksInYear();

    this.weekOptions = [];
    for (let w = 1; w <= weeks; w++) {
      let week: ItemOption = { label: w.toString(), value: w };
      this.weekOptions.push(week);
    }
  }

  private initYears() {
    let thisYear = moment().year();
    let nextYearsCnt = 3;

    for (let y = thisYear; y <= thisYear + nextYearsCnt; y++) {
      let year: ItemOption = { label: y.toString(), value: y };
      this.yearsOptions.push(year);
    }

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

  private async initAsync() {
    await this.taskDetailSvc.reloadAsync(this.id);

    var tr = this.taskDetailSvc.res.task;

    if (tr.type === TaskTypeEnum.Unassigned) {
      let now = moment().utc().startOf('d');
      let year = now.year();
      let week = now.isoWeek();
      let month = now.month() + 1;

      let dateFrom = now.clone();
      let dateTo = dateFrom.clone().add(2, 'd');

      this.vm = {
        id: tr.id,
        name: tr.name,
        type: tr.type,
        desc: tr.desc,

        manDays: 0,
        manHours: 0,

        week,
        month,
        year,

        dateFrom,
        dateTo
      };
    } else {
      this.vm = {
        id: tr.id,
        name: tr.name,
        type: tr.type,
        desc: tr.desc,

        manDays: tr.manDays,
        manHours: tr.manHours,

        week: tr.week,
        month: tr.month,
        year: tr.year,

        dateFrom: moment.utc(tr.dateFrom),
        dateTo: moment.utc(tr.dateTo)
      };
    }

    this.initWeeks(this.vm.year);

    this.initialized = true;
  }


  public updateClick() {
    this.updateTaskAsync();
  }

  private async updateTaskAsync() {
    let req: TaskResponse = {
      id: this.vm.id,
      name: this.vm.name,
      type: this.vm.type,
      desc: this.vm.desc,
      manDays: this.vm.manDays,
      manHours: this.vm.manHours,
      month: this.vm.month,
      week: this.vm.week,
      year: this.vm.year,
      dateFrom: this.vm.dateFrom.format('YYYY-MM-DD'),
      dateTo: this.vm.dateTo.format('YYYY-MM-DD')
    };

    await this.taskApiSvc.update(req);
    this.onSavedEvent.next();
    this.closeDialog();
  }

  private closeDialog() {
    this.dialogSvc.destroy();
  }

  public dateRangeChange() {

  }



}

export interface TaskEditVM {
  id: string;
  name: string;
  type: TaskTypeEnum;

  desc: string;

  dateFrom?: Moment;
  dateTo?: Moment;
  week?: number;
  year?: number;
  month?: number;

  manHours?: number;
  manDays?: number;
}
