import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { UpdatePropRequest, UserRequest, UserResponse } from './user-ints';

@Injectable({ providedIn: 'root' })
export class UserApiService {

  constructor(private restApiSvc: RestApiService) { }

  public async updateProp(req: UpdatePropRequest) {
    let res = await this.restApiSvc.putAsync<boolean>('user/prop', req);
    return res;
  }

  public async update(req: UserRequest) {
    let res = await this.restApiSvc.putAsync<boolean>('user', req);
    return res;
  }

  public async find(s: string) {
    let req = { s };
    let res = await this.restApiSvc.getAsync<UserResponse[]>('user/find', req);
    return res;
  }

  public async getLoggedUser() {
    let res = await this.restApiSvc.getAsync<UserResponse>('user/me');
    return res;
  }

  public async getById(id: string) {
    let req = { id };
    let res = await this.restApiSvc.getAsync<UserResponse>('user', req);
    return res;
  }


}
