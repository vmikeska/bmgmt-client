import { Injectable } from '@angular/core';
import { ProjectApiService } from 'src/app/api/project/project-api.service';
import { ProjectResponse } from 'src/app/api/project/project-ints';
import { TaskApiService } from 'src/app/api/task/task-api.service';
import { TaskTypeEnum, TaskResponse } from 'src/app/api/task/task-ints';
import { CrationTypeEnum, CreationTypeItem } from 'src/app/components/comps-ints';
import { RedirectService } from 'src/app/services/redirect.service';
import { DashboardDataService } from './dashboard-page';


@Injectable({ providedIn: 'root' })
export class DashboardQuickActionsService {

  constructor(
    private redirSvc: RedirectService,
    private projApiSvc: ProjectApiService,
    private taskApiSvc: TaskApiService,
    private dashDataSvc: DashboardDataService
  ) {
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

  public createItemClick() {
    this.createItemAsync();
  }

  private async createItemAsync() {

    if (this.creationType === CrationTypeEnum.Project) {
      let id = await this.createProjectAsync();
      this.redirSvc.toProject(id);
    } else {
      let taskId = await this.createTaskAsync();
      if (this.creationType === CrationTypeEnum.FullTask) {
        this.redirSvc.toTask(taskId);
      } else {
        //todo: reload just tasks, or apppend response ?
        this.dashDataSvc.loadDataAsync();
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

    var projId = await this.projApiSvc.create(req);
    return projId;
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
}
