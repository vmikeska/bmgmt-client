import { Component, Injectable, OnInit, ViewEncapsulation } from '@angular/core';
import { TaskTypeEnum } from 'src/app/api/task/task-ints';
import { PageIdEnum } from '../page-id';
import { faPlus, faCamera } from '@fortawesome/free-solid-svg-icons';
import { DashboardQuickActionsService } from './dashboard-quick-actions.service';
import { DashListItem } from 'src/app/components/dash-items-list/dash-items-list';
import { RedirectService } from 'src/app/services/redirect.service';
import { ProjectEntity, TaskEntity } from 'src/app/data/entities/entities';
import { ProjectEntityOperations, TaskEntityOperations } from 'src/app/data/entity-operations';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: 'dashboard-page.html',
  styleUrls: ['dashboard-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashboardPageComponent implements OnInit {
  constructor(

    private redirSvc: RedirectService,
    public dashQuickSvc: DashboardQuickActionsService,
    public dashDataSvc: DashboardDataService
  ) { }

  public ngOnInit() {
    this.dashDataSvc.loadData();
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
    this.dashDataSvc.loadData();
  }

}

@Injectable({ providedIn: 'root'})
export class DashboardDataService {
  constructor(
    private taskEntSvc: TaskEntityOperations,
    private projectEntSvc: ProjectEntityOperations,
  ) {}

  public filter = '';

  public simpleTasks: DashListItem[] = [];
  public calendarTasks: DashListItem[] = [];
  public projects: DashListItem[] = [];

  public loadData() {
    let simpleTasksRes = this.taskEntSvc.list.filter(t => t.type === TaskTypeEnum.Unassigned);
    let otherTasksRes = this.taskEntSvc.list.filter(t => t.type !== TaskTypeEnum.Unassigned);

    this.simpleTasks = this.mapTasksToListItems(simpleTasksRes);
    this.calendarTasks = this.mapTasksToListItems(otherTasksRes);
    this.projects = this.mapProjsToListItems(this.projectEntSvc.list);
  }

  private mapTasksToListItems(tasks: TaskEntity[]) {
    return tasks.map( t => {
      let task: DashListItem = {
        id: t.id,
        name: t.name
      };
      return task;
    });
  }

  private mapProjsToListItems(projs: ProjectEntity[]) {
    return projs.map( t => {
      let task: DashListItem = {
        id: t.id,
        name: t.name
      };
      return task;
    });
  }

}

