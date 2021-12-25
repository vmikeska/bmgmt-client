import { T } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { faBriefcase, faCalendarAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';
import { ConfigLoaderService } from 'src/app/api/account/config-loader.service';
import { TaskResponse, TaskTypeEnum, WorkloadMonthResponse, WorkloadRequest } from 'src/app/api/task/task-ints';
import { DialogService } from 'src/app/dialogs/base/dialog.service';
import { CalendarDayDialogComponent } from 'src/app/dialogs/calendar-day-dialog/calendar-day-dialog';
import { CalendarTaskDialogComponent } from 'src/app/dialogs/calendar-task-dialog/calendar-task-dialog';
import { TaskBaseEditDialogComponent, TaskEditTypeModeEnum } from 'src/app/dialogs/task-base-edit-dialog/task-base-edit-dialog';
import { WorkloadUtilsService } from 'src/app/utils/workload-utils.service';
import { PageIdEnum } from '../page-id';
import { Day, Month, TaskVM, Week, WorkLoadDataLoaderService } from './work-load-data-loader.service';
import { WorkloadFilterService } from './work-load-filter.service';

@Component({
  selector: 'app-work-load-page',
  templateUrl: 'work-load-page.html',
  styleUrls: ['work-load-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class WorkLoadComponent implements OnInit {
  constructor(
    private wldlSvc: WorkLoadDataLoaderService,
    private wlUtilsSvc: WorkloadUtilsService,
    private router: Router,
    private configSvc: ConfigLoaderService,
    public workloadFilterSvc: WorkloadFilterService,
    private dlgSvc: DialogService
  ) { }

  public activeId = PageIdEnum.Workload;

  faCalendarAlt = faCalendarAlt;
  faBriefcase = faBriefcase;
  faPlus = faPlus;

  public months: Month[] = [];

  public get daysPerWeek() {
    return this.useDays.length;
  }

  public addCommonTaskClick() {
    alert('not implemented');
  }

  public ngOnInit() {
    this.loadDataAsync();
  }

  public taskDetailClick(id: string) {
    let dlg = this.dlgSvc.create(CalendarTaskDialogComponent, (m) => {
      m.taskId = id;
      m.reloadNeededEvent.subscribe(() => {
        this.loadDataAsync();
      });
    });
  }

  private async loadDataAsync() {
    let req: WorkloadRequest = {
      useDays: this.useDays,
      from: this.workloadFilterSvc.from.toISOString(),
      to: this.workloadFilterSvc.to.toISOString(),
    };

    await this.wldlSvc.loadDataAsync(req);

    this.buildWorkloadView();
    this.assignMonthAndWeekTasks();
  }

  public showDatesOrDays?: boolean = null;

  public datesClick() {
    if (this.showDatesOrDays === null) {
      this.showDatesOrDays = true;
      return;
    }

    if (this.showDatesOrDays === true) {
      this.showDatesOrDays = null;
      return;
    }

    this.showDatesOrDays = true;
  }

  public daysClick() {
    if (this.showDatesOrDays === null) {
      this.showDatesOrDays = false;
      return;
    }

    if (this.showDatesOrDays === false) {
      this.showDatesOrDays = null;
      return;
    }

    this.showDatesOrDays = false;
  }

  public get useDays() {
    let res: number[] = [];

    this.workloadFilterSvc.filterDays.forEach((d) => {
      if (d.selected) {
        res.push(d.no);
      }
    });

    return res;
  }



  public useWeekendChange() {
    this.loadDataAsync();
  }

  public dateRangeChange() {
    this.loadDataAsync();
  }

  public logBtnClick(day: Day) {
    console.log(day)
  }

  public addMonthClick(month: Month) {
    let dlg = this.dlgSvc.create(TaskBaseEditDialogComponent, (m) => {
      m.mode = TaskEditTypeModeEnum.AddMonth;
      m.title = "Add month task";
      m.month = month.no;
      m.year = month.year;
      m.onSavedEvent.subscribe(() => {
        this.loadDataAsync();
      });
    });
  }

  public addWeekClick(week: Week) {
    let dlg = this.dlgSvc.create(TaskBaseEditDialogComponent, (m) => {
      m.mode = TaskEditTypeModeEnum.AddWeek;
      m.title = "Add week task";
      m.week = week.no;
      m.year = week.year;
      m.onSavedEvent.subscribe(() => {
        this.loadDataAsync();
      });
    });
  }

  public dayClick(day: Day) {
    let dlg = this.dlgSvc.create(CalendarDayDialogComponent, (m) => {
      m.day = day;
      m.workloadRef = this;
    });
  }

  private buildWorkloadView() {
    this.months = [];

    for (let week of this.wldlSvc.weeks) {

      let firstWeekDay = week.days[0].day;
      let lastWeekDay = week.days[6].day;

      let startingMonthNo = firstWeekDay.month() + 1;
      let endingMonthNo = lastWeekDay.month() + 1;

      let month = this.getMonth(firstWeekDay.year(), startingMonthNo);
      month.weeks.push(week);

      let isSplitIntoTwoMonths = startingMonthNo != endingMonthNo;
      if (isSplitIntoTwoMonths) {
        let secondMonth = this.getMonth(lastWeekDay.year(), endingMonthNo);
        secondMonth.weeks.push(week);
      }

    }

    this.months = this.months.filter((m) => {
      if (m.weeks.length > 1) {
        return true;
      }

      let week = m.weeks[0];

      let involvedMonths = week.days.map((i) => { return i.day.month(); });
      let isTwoMonthsWeek = involvedMonths.length > 1;
      let keep = !isTwoMonthsWeek;
      return keep;
    });

  }

  public get dayWorkingHours() {
    return this.configSvc.response.dayWorkingHours;
  }

  private getMonth(year: number, month: number) {
    let existing = this.months.find((m) => { return m.year === year && m.no === month; });
    if (existing) {
      return existing;
    }

    let monthStart = moment(`${year}-${month}-1`);


    let resMonth = this.getResponseMonth(year, month);

    // let tasksRes = res.tasks.filter((i) => {
    //   return resMonth.involvedTasksIds.includes(i.id);
    // });

    // let tasks = tasksRes.map((tr) => {
    //   let t: TaskVM = {
    //     id: tr.id,
    //     name: tr.name,
    //     type: tr.type
    //   };
    //   return t;
    // });

    // let monthTask = tasks.filter(t => t.type === TaskTypeEnum.Month);

    let newMonth: Month = {
      year,
      tasks: [], //monthTask,
      totalHours: resMonth.totalHours,
      workingDays: resMonth.workingDays,
      no: month,
      weeks: [],
      title: `${year} - ${monthStart.format('MMMM')}`,
      workloadStr: this.wlUtilsSvc.daysHoursStr(0, resMonth.totalHours),
    };
    this.months.push(newMonth);

    return newMonth;
  }

  private getResponseMonth(year: number, month: number) {
    let res = this.wldlSvc.response;
    let resMonth = res.months.find((m) => { return m.year === year && m.no === month; });
    return resMonth;
  }

  private assignMonthAndWeekTasks() {

    this.months.forEach((vmMonth) => {
      let resMonth = this.getResponseMonth(vmMonth.year, vmMonth.no);

      let resTasks = this.wldlSvc.response.tasks;

      let thisMonthResTasks = resTasks.filter((resTask) => {
        return resMonth.involvedTasksIds.includes(resTask.id);
      });

      let tasks = thisMonthResTasks.map((tr) => {

        let t: TaskVM = {
          id: tr.id,
          name: tr.name,
          type: tr.type,
          month: tr.month,
          week: tr.week,
          year: tr.year
        };
        return t;
      });

      let monthlyResTasks = tasks.filter(t => t.type === TaskTypeEnum.Month);
      vmMonth.tasks = monthlyResTasks;

      vmMonth.weeks.forEach((vmWeek) => {

        if (vmWeek.no === 52) {
          var a = 'dsfd';
        }

        //this is more like bugfix, coz there are not comming data from the same week that takes place in two monts, fix later
        let hasAlreadyLoadadDataForThisWeek = !!vmWeek.tasks.length;

        if (!hasAlreadyLoadadDataForThisWeek) {
          let weeklyResTasks = tasks.filter(t =>
            t.type === TaskTypeEnum.Week
            &&
            t.year === vmWeek.year
            &&
            t.week === vmWeek.no
          );
          vmWeek.tasks = weeklyResTasks;
        }

      });
    });

  }

}

export interface DayFilterItem {
  selected: boolean;
  no: number;
  label: string;
}






