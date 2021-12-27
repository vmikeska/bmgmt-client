import { Component, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectApiService } from 'src/app/api/project/project-api.service';
import { TaskApiService } from 'src/app/api/task/task-api.service';
import { TaskResponse, TaskTypeEnum } from 'src/app/api/task/task-ints';
import { PageIdEnum } from '../page-id';
import { faPlus, faCamera } from '@fortawesome/free-solid-svg-icons';
import { TaskMapService } from 'src/app/components/assigned-tasks-list/tasksMap.service';
import { DatedBlockTasksVM, ProjItemVM } from 'src/app/components/comps-ints';
import { DashboardQuickActionsService } from './dashboard-quick-actions.service';
import { DashProjResponse, DashResultRequest, DashTaskResponse } from 'src/app/api/dashboard/dashboard-ints';
import { DashListItem } from 'src/app/components/dash-items-list/dash-items-list';
import { DashboardApiService } from 'src/app/api/dashboard/dashboard-api.service';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard-page.html',
  styleUrls: ['dashboard-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardPageComponent implements OnInit {
  constructor(
    private taskApiSvc: TaskApiService,
    private projApiSvc: ProjectApiService,
    private taskMapSvc: TaskMapService,
    private dashApiSvc: DashboardApiService,

    private redirSvc: RedirectService,
    public dashQuickSvc: DashboardQuickActionsService,
    public dashDataSvc: DashboardDataService
  ) { }

  public ngOnInit() {
    this.dashDataSvc.loadDataAsync();
    // this.loadUnassignedTasks();
    // this.loadAssignedTasks();
    // this.loadProjectsAsync();
  }

  public addPhotoTaskClick() {
    alert('not implemented');
  }

  public addPhotoProjectClick() {
    alert('not implemented');
  }

  public activeId = PageIdEnum.Dashboard;

  faPlus = faPlus;
  faCamera = faCamera;

  public taskItemClick(id: string) {
    this.redirSvc.toTask(id);
  }

  public projItemClick(id: string) {
    this.redirSvc.toProject(id);
  }

  public filterChange() {
    this.dashDataSvc.loadDataAsync();
  }



  // public unassignedTasks: TaskResponse[] = [];
  // public assignedTasks: DatedBlockTasksVM;
  // public projects: ProjItemVM[] = [];


  // private async loadUnassignedTasks() {
  //   let tasks = await this.taskApiSvc.getUnassignedTasks();
  //   this.unassignedTasks = tasks;
  // }

  // private async loadAssignedTasks() {
  //   let tasks = await this.taskApiSvc.getDashboardTasks();
  //   this.assignedTasks = {
  //     dates: tasks.dates.map(i => this.taskMapSvc.mapTaskVM(i)),
  //     months: tasks.months.map(i => this.taskMapSvc.mapTaskVM(i)),
  //     weeks: tasks.weeks.map(i => this.taskMapSvc.mapTaskVM(i))
  //   }
  // }

  // private async loadProjectsAsync() {
  //   let res = await this.projApiSvc.getList();

  //   this.projects = res.map((i) => {
  //     let item: ProjItemVM = {
  //       id: i.id,
  //       name: i.name
  //     };
  //     return item;
  //   });

  // }

}

@Injectable({ providedIn: 'root'})
export class DashboardDataService {
  constructor(
    private dashApiSvc: DashboardApiService,
  ) {}

  public filter = '';

  public simpleTasks: DashListItem[] = [];
  public calendarTasks: DashListItem[] = [];
  public projects: DashListItem[] = [];

  public async loadDataAsync() {
    let req: DashResultRequest = {
      onlyUnfinished: true,
      search: this.filter
    };

    let res = await this.dashApiSvc.dashboardData(req);

    let simpleTasksRes = res.tasks.filter(t => t.type === TaskTypeEnum.Unassigned);
    let otherTasksRes = res.tasks.filter(t => t.type !== TaskTypeEnum.Unassigned);

    this.simpleTasks = this.mapTasksToListItems(simpleTasksRes);
    this.calendarTasks = this.mapTasksToListItems(otherTasksRes);
    this.projects = this.mapProjsToListItems(res.projs);
  }

  private mapTasksToListItems(tasks: DashTaskResponse[]) {
    return tasks.map( t => {
      let task: DashListItem = {
        id: t.id,
        name: t.name
      };
      return task;
    });
  }

  private mapProjsToListItems(projs: DashProjResponse[]) {
    return projs.map( t => {
      let task: DashListItem = {
        id: t.id,
        name: t.name
      };
      return task;
    });
  }

}

