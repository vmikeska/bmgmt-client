import { Component, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { faCheck, faClock, faEye, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Subject } from 'rxjs';
import { TaskApiService } from 'src/app/api/task/task-api.service';
import { TaskResponse } from 'src/app/api/task/task-ints';
import { PageIdEnum } from 'src/app/pages/page-id';
import { TaskUtils } from "src/app/services/task-utils";
import { WorkloadUtilsService } from 'src/app/utils/workload-utils.service';
import { DialogService } from '../base/dialog.service';

@Component({
  selector: 'app-calendar-task-dialog',
  templateUrl: 'calendar-task-dialog.html',
  styleUrls: ['calendar-task-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CalendarTaskDialogComponent implements OnInit {
  constructor(
    private taskApiSvc: TaskApiService,
    private wlUtilsSvc: WorkloadUtilsService,
    private router: Router,
    private dlgSvc: DialogService
  ) { }

  faTimes = faTimes;
  faClock = faClock;
  faCheck = faCheck;
  faEye = faEye;

  public ngOnInit() {
    this.loadTaskAsync();
  }

  private async loadTaskAsync() {
    this.taskRes = await this.taskApiSvc.getById(this.taskId);

    this.title = this.taskRes.name;
    this.desc = this.taskRes.desc;
    // this.load = TaskUtils.getTaskTypeDesc(this.taskRes);
  }

  public taskRes: TaskResponse;

  public title = '';
  public desc = '';
  public load = '';

  @Input()
  public taskId: string;

  @Output()
  public reloadNeededEvent = new Subject();


  private redirectToDetail(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }

  private async deleteTaskAsync() {
    await this.taskApiSvc.delete(this.taskId);
    this.reloadNeededEvent.next();
    this.dlgSvc.destroy();
  }


  public deleteClick() {
    this.deleteTaskAsync();
  }

  public compensateClick() {
    alert('not implemented');
  }

  public finishClick() {
    alert('not implemented');
  }

  public detailClick() {
    this.redirectToDetail(this.taskId);
    this.dlgSvc.destroy();
  }

}

