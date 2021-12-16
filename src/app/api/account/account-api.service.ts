import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { InfoConfigResponse, LoginRequest, NewAccountRequest } from './account-ints';

@Injectable({ providedIn: 'root' })
export class AccountApiService {

  constructor(private restApiSvc: RestApiService) { }

  public async test() {
    let res = await this.restApiSvc.postAsync<boolean>('account/test-db', { p: 'prm-val' });
    return res;
  }

  public async create(req: NewAccountRequest) {
    let res = await this.restApiSvc.postAsync<boolean>('account', req);
    return res;
  }

  public async login(req: LoginRequest) {
    let res = await this.restApiSvc.postAsync<boolean>('account/login', req);
    return res;
  }

  public async infoConfig() {
    let res = await this.restApiSvc.postAsync<InfoConfigResponse>('account/info');
    return res;
  }


}
