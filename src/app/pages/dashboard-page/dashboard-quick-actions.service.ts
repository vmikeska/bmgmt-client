import { Injectable } from '@angular/core';
import { TaskTypeEnum } from 'src/app/api/task/task-ints';
import { CrationTypeEnum as CreationTypeEnum, CreationTypeItem } from 'src/app/components/comps-ints';
import { ProjectEntityOperations, TaskEntityOperations } from 'src/app/data/entity-operations';
import { ProjectDO } from 'src/app/models/project/project-model-ints';
import { ProjectModelService } from 'src/app/models/project/project-model.service';
import { TaskDO } from 'src/app/models/task/task-model-ints';
import { TaskModelService } from 'src/app/models/task/task-model.service';
import { RedirectService } from 'src/app/services/redirect.service';
import { DashboardDataService } from './dashboard-page';


@Injectable({ providedIn: 'root' })
export class DashboardQuickActionsService {

  constructor(
    private redirSvc: RedirectService,
    private dashDataSvc: DashboardDataService,

    private projectEntSvc: ProjectEntityOperations,
    private taskEntSvc: TaskEntityOperations,
    private taskModelSvc: TaskModelService,
    private projModelSvc: ProjectModelService
  ) {
  }

  public creationName = '';

  public creationType = CreationTypeEnum.SimpleTask;

  public creationTypes: CreationTypeItem[] = [
    {
      label: 'Quick task',
      value: CreationTypeEnum.SimpleTask
    },
    {
      label: 'Full task',
      value: CreationTypeEnum.FullTask
    },
    {
      label: 'Project',
      value: CreationTypeEnum.Project
    },
  ];

  public get newButtonText() {
    if (this.creationType === CreationTypeEnum.Project) {
      return 'New Project';
    }

    return 'New Task';
  }

  public get newInputText() {
    if (this.creationType === CreationTypeEnum.Project) {
      return 'Project name';
    }

    return 'Task name';
  }

  public createItemClick() {
    this.createItemAsync();
  }

  private async createItemAsync() {

    if (this.creationType === CreationTypeEnum.Project) {
      let projEntity = this.createProject();
      this.redirSvc.toProject(projEntity.id);
    } else {
      let taskId = this.createTask();
      if (this.creationType === CreationTypeEnum.FullTask) {
        this.redirSvc.toTask(taskId);
      } else {
        this.dashDataSvc.loadData();
      }
    }

    this.creationName = '';
  }

  private createProject() {

    let ent: ProjectDO = {
      name: this.creationName,
      desc: ''
    };


    let id = this.projModelSvc.create(ent);
    return id;
  }

  private createTask() {

    let d: TaskDO = {
      name: this.creationName,
      type: TaskTypeEnum.Unassigned,
      desc: ''
    };

    let e = this.taskEntSvc.create(d);
    return e.id;
  }
}
