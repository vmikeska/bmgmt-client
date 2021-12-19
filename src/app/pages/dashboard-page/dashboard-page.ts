import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectApiService } from 'src/app/api/project/project-api.service';
import { ProjectResponse } from 'src/app/api/project/project-ints';
import { TaskApiService } from 'src/app/api/task/task-api.service';
import { TaskTypeEnum, TaskResponse } from 'src/app/api/task/task-ints';
import { PageIdEnum } from '../page-id';
import { faPlus, faCamera } from '@fortawesome/free-solid-svg-icons';
import { TaskMapService } from 'src/app/components/assigned-tasks-list/tasksMap.service';
import { CrationTypeEnum, CreationTypeItem, DatedBlockTasksVM, ProjItemVM } from 'src/app/components/comps-ints';

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
    private router: Router,
    private taskMapSvc: TaskMapService
  ) { }

  public ngOnInit() {
    this.loadUnassignedTasks();
    this.loadAssignedTasks();
    this.loadProjectsAsync();
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

  public get newButtonText() {
    if (this.creationType === CrationTypeEnum.Project) {
      return 'New Project';
    }

    return 'New Task';
  }

  public get newInputText() {
    if (this.creationType === CrationTypeEnum.Project) {
      return 'Project name';
    }

    return 'Task name';
  }


  public creationName = '';

  public creationType = CrationTypeEnum.SimpleTask;

  public creationTypes: CreationTypeItem[] = [
    {
      label: 'Quick task',
      value: CrationTypeEnum.SimpleTask
    },
    {
      label: 'Full task',
      value: CrationTypeEnum.FullTask
    },
    {
      label: 'Project',
      value: CrationTypeEnum.Project
    },
  ];

  public unassignedTasks: TaskResponse[] = [];
  public assignedTasks: DatedBlockTasksVM;
  public projects: ProjItemVM[] = [];

  public createItemClick() {
    this.createItemAsync();
  }



  private async createItemAsync() {

    if (this.creationType === CrationTypeEnum.Project) {
      let id = await this.createProjectAsync();
      this.redirectToProjectDetail(id);
    } else {
      let taskId = await this.createTaskAsync();
      if (this.creationType === CrationTypeEnum.FullTask) {
        this.redirectToTaskDetail(taskId);
      } else {
        this.loadUnassignedTasks();
      }
    }

    this.creationName = '';
  }

  private async createProjectAsync() {
    let req: ProjectResponse = {
      id: null,
      name: this.creationName,
      desc: ''
    };

    var taskId = await this.projApiSvc.create(req);
    return taskId
  }

  private async createTaskAsync() {
    let req: TaskResponse = {
      id: null,
      name: this.creationName,
      type: TaskTypeEnum.Unassigned,
      desc: ''
    };

    var taskId = await this.taskApiSvc.create(req);
    return taskId;
  }

  private redirectToTaskDetail(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }

  private redirectToProjectDetail(id: string) {
    let url = `${PageIdEnum.ProjectDetail}/id/${id}`;
    this.router.navigate([url]);
  }

  private async loadUnassignedTasks() {
    let tasks = await this.taskApiSvc.getUnassignedTasks();
    this.unassignedTasks = tasks;
  }

  private async loadAssignedTasks() {
    let tasks = await this.taskApiSvc.getDashboardTasks();
    this.assignedTasks = {
      dates: tasks.dates.map(i => this.taskMapSvc.mapTaskVM(i)),
      months: tasks.months.map(i => this.taskMapSvc.mapTaskVM(i)),
      weeks: tasks.weeks.map(i => this.taskMapSvc.mapTaskVM(i))
    }
  }

  private async loadProjectsAsync() {
    let res = await this.projApiSvc.getList();

    this.projects = res.map((i) => {
      let item: ProjItemVM = {
        id: i.id,
        name: i.name
      };
      return item;
    });

  }

}

