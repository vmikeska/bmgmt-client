import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { WorkloadRequest, WorkloadResponse } from './task-ints';

@Injectable({ providedIn: 'root' })
export class TaskBusynessApiService {

    constructor(private restApiSvc: RestApiService) { }

    public async getWorkloadPageData(req: WorkloadRequest) {
        let res = await this.restApiSvc.getAsync<WorkloadResponse>('task-workload', req);
        return res;
    }
}
