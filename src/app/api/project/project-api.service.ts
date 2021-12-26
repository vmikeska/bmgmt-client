import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { TaskGroupsResponse, TaskResponse } from '../task/task-ints';
import { UpdatePropRequest } from '../user/user-ints';
import { ProjectDetailResponse, ProjectResponse, ProjectTaskBindingRequest } from './project-ints';

@Injectable({ providedIn: 'root' })
export class ProjectApiService {

  constructor(private restApiSvc: RestApiService) { }

  public async getDetailById(id: string) {
    let req = {
      id
    };

    let res = await this.restApiSvc.getAsync<ProjectDetailResponse>('project/detail', req);
    return res;
  }

  public async getById(id: string) {
    let req = {
      id
    };

    let res = await this.restApiSvc.getAsync<ProjectResponse>('project', req);
    return res;
  }

  public async create(req: ProjectResponse) {
    let res = await this.restApiSvc.postAsync<string>('project', req);
    return res;
  }

  // public async update(req: ProjectResponse) {
  //   let res = await this.restApiSvc.putAsync<string>('project', req);
  //   return res;
  // }

  public async updateProp(req: UpdatePropRequest) {
    let res = await this.restApiSvc.putAsync<boolean>('project/prop', req);
    return res;
  }

  public async getList() {
    let res = await this.restApiSvc.getAsync<ProjectResponse[]>('project/list');
    return res;
  }

  public async getListParticip() {
    let res = await this.restApiSvc.getAsync<ProjectResponse[]>('project/list-particip');
    return res;
  }

  public async getProjectAssignedTasks(id: string) {
    let req = { id };
    let res = await this.restApiSvc.getAsync<TaskGroupsResponse>('project/assigned-tasks', req);
    return res;
  }

  public async getProjectUnassignedTasks(id: string) {
    let req = { id };
    let res = await this.restApiSvc.getAsync<TaskResponse[]>('project/unassigned-tasks', req);
    return res;
  }

  public async assignTask(req: ProjectTaskBindingRequest) {
    let res = await this.restApiSvc.postAsync<string>('project/assign-task', req);
    return res;
  }

  public async unassignTask(taskId: string) {

    let req = { taskId };

    let res = await this.restApiSvc.deleteAsync<boolean>('project/unassign-task', req);
    return res;
  }
}
