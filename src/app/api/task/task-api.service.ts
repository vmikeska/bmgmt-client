import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { TaskDateTypeResponse, TaskDetailResponse, TaskGroupsResponse, TaskResponse } from './task-ints';

@Injectable({ providedIn: 'root' })
export class TaskApiService {

  constructor(private restApiSvc: RestApiService) { }

  public async getById(id: string) {
    let req = {
      id
    };

    let res = await this.restApiSvc.getAsync<TaskResponse>('task', req);
    return res;
  }




  public async getDetailById(id: string) {
    let req = {
      id
    };

    let res = await this.restApiSvc.getAsync<TaskDetailResponse>('task/detail', req);
    return res;
  }

  public async getUnassignedTasks() {
    let res = await this.restApiSvc.getAsync<TaskResponse[]>('task/unassigned');
    return res;
  }

  public async getDashboardTasks() {
    let res = await this.restApiSvc.getAsync<TaskGroupsResponse>('task/dashboard-tasks');
    return res;
  }

  public async create(req: TaskResponse) {
    let res = await this.restApiSvc.postAsync<string>('task', req);
    return res;
  }

  // public async update(req: TaskResponse) {
  //   let res = await this.restApiSvc.putAsync<string>('task', req);
  //   return res;
  // }

  public async updateType(req: TaskDateTypeResponse) {
    let res = await this.restApiSvc.putAsync<boolean>('task/type', req);
    return res;
  }

  public async delete(id: string) {
    let req = { id };
    let res = await this.restApiSvc.deleteAsync<string>('task', req);
    return res;
  }

}
