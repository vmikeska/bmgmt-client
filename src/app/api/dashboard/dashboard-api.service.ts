import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { DashResultRequest, DashResultResponse } from './dashboard-ints';

@Injectable({ providedIn: 'root' })
export class DashboardApiService {

  constructor(private restApiSvc: RestApiService) { }

  public async dashboardData(req: DashResultRequest) {
    let res = await this.restApiSvc.getAsync<DashResultResponse>('dashboard', req);
    return res;
  }


}
