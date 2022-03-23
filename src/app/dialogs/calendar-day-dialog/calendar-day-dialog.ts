import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { faCheck, faClock, faEye, faPlus, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { TaskApiService } from 'src/app/api/task/task-api.service';
import { TaskResponse } from 'src/app/api/task/task-ints';
import { PageIdEnum } from 'src/app/pages/page-id';
import { Day, WorkLoadDataLoaderService } from 'src/app/pages/work-load-page/work-load-data-loader.service';
import { TaskUtils } from "src/app/services/task-utils";
import { WorkloadUtilsService } from 'src/app/utils/workload-utils.service';
import { DialogService } from '../base/dialog.service';
import { CalendarTaskDialogComponent } from '../calendar-task-dialog/calendar-task-dialog';
import { TaskBaseEditDialogComponent, TaskEditTypeModeEnum } from '../task-base-edit-dialog/task-base-edit-dialog';

@Component({
  selector: 'app-calendar-day-dialog',
  templateUrl: 'calendar-day-dialog.html',
  styleUrls: ['calendar-day-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CalendarDayDialogComponent implements OnInit {
  constructor(
    // private taskApiSvc: TaskApiService,
    private wlUtilsSvc: WorkloadUtilsService,
    private wldlSvc: WorkLoadDataLoaderService,
    private router: Router,
    private dlgSvc: DialogService
  ) { }

  faPlus = faPlus;

  @Input()
  public day: Day;

  public title: string;

  public workloadStr: string;

  //current hack before refactoring workload page/ workload load service that the reload can be rached easirer
  public workloadRef: any;

  public tasks: TaskInfoVM[] = [];

  public ngOnInit() {
    this.buildView();
  }

  private buildView() {
    let date = this.day.day;
    this.title = date.format('dddd DD.MM.YYYY');
    this.workloadStr = this.wlUtilsSvc.daysHoursStr(0, this.day.totalHours);


    this.tasks = this.day.response.loads.map((l) => {
      let task = this.wldlSvc.response.tasks.find(i => i.id === l.taskId);

      let vm: TaskInfoVM = {
        id: task.id,
        name: task.name,
        workload: this.wlUtilsSvc.daysHoursStr(0, l.hours)
      };
      return vm;
    });
  }

  public addTaskClick() {
    let thisDlgRef = this.dlgSvc.componentRef;
    let workloadRef = thisDlgRef.instance.workloadRef;

    let dlg = this.dlgSvc.create(TaskBaseEditDialogComponent, (m) => {
      m.mode = TaskEditTypeModeEnum.AddDay;
      m.title = "Add day task";
      m.dateFrom = this.day.day;
      m.dateTo = this.day.day;
      m.onSavedEvent.subscribe(() => {
        workloadRef.loadDataAsync();
      });
    });

    thisDlgRef.destroy();
  }

  public taskClick(id: string) {
    this.redirectToTaskDetail(id);
    this.dlgSvc.destroy();
  }

  private redirectToTaskDetail(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }
}

export interface TaskInfoVM {
  id: string;
  name: string;
  workload: string;
}

