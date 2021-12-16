import { Injectable } from '@angular/core';
import { } from 'lodash-es';
import { RestMethodGetService } from './rest-method-get.service';
import { RestMethodPostService } from './rest-method-post.service';
import { RestMethodBaseService } from './rest-method-base.service';
import { RestMethodPutService } from './rest-method-put.service';
import { RestMethodDeleteService } from './rest-method-delete.service';
import { Subject } from 'rxjs';
import { Logger } from '../base/logger';
import { ApiResult, ApiResultCode } from './req-res-base';

@Injectable({ providedIn: "root" })
export class RestApiService {

    constructor(
        private getSvc: RestMethodGetService,
        private postSvc: RestMethodPostService,
        private putSvc: RestMethodPutService,
        private deleteSvc: RestMethodDeleteService
    ) { }

    public apiErrorEvent = new Subject<ApiResult<any>>();
    public generalErrorEvent = new Subject<any>();

    public async getAsync<T>(endpoint: string, data: any = null) {

        Logger.info(RestApiService, `req-${endpoint}`, data);
        let start = performance.now();
        let res = await this.handleExecutionAsync<T>(this.getSvc, endpoint, data);
        let timeStr = this.getTimeStr(start);
        Logger.info(RestApiService, `res-${endpoint} in ${timeStr} sec`, res);
        return res;
    }

    public async postAsync<T>(endpoint: string, data: any = null) {
        Logger.info(RestApiService, `req-${endpoint}`, data);
        let start = performance.now();
        let res = await this.handleExecutionAsync<T>(this.postSvc, endpoint, data);
        let timeStr = this.getTimeStr(start);
        Logger.info(RestApiService, `res-${endpoint} in ${timeStr} sec`, res);
        return res;
    }


    public async putAsync<T>(endpoint: string, data: any = null) {
        Logger.info(RestApiService, `req-${endpoint}`, data);
        let start = performance.now();
        let res = await this.handleExecutionAsync<T>(this.putSvc, endpoint, data);
        let timeStr = this.getTimeStr(start);
        Logger.info(RestApiService, `res-${endpoint} in ${timeStr} sec`, res);
        return res;
    }

    public async deleteAsync<T>(endpoint: string, data: any = null) {
        Logger.info(RestApiService, `req-${endpoint}`, data);
        let start = performance.now();
        let res = await this.handleExecutionAsync<T>(this.deleteSvc, endpoint, data);
        let timeStr = this.getTimeStr(start);
        Logger.info(RestApiService, `res-${endpoint} in ${timeStr} sec`, res);
        return res;
    }

    private getTimeStr(t1: number) {
        let ms = performance.now() - t1;
        let s = (ms / 1000);
        return s.toFixed(3);
    }

    private async handleExecutionAsync<T>(svc: RestMethodBaseService, endpoint: string, data: any = null) {
        let responsePromise = svc.executeAsync<ApiResult<T>>(endpoint, data);

        let myResponse = responsePromise.then((resp) => {

            if (!resp) {
                return null;
            }

            let isDirty = (resp.result === ApiResultCode.ERROR || resp.result === ApiResultCode.WARNING);
            if (resp && resp.result && isDirty) {
                Logger.info(RestApiService, 'API error: ', endpoint, data);
                this.apiErrorEvent.next(resp);
            }

            return resp.data;
        }).catch((error) => {
            this.generalErrorEvent.next(error);
            return new Promise<T>(error);
        });

        let response = await myResponse;
        return response;
    }

    public async handleExecutionRawAsync<T>(svc: RestMethodBaseService, endpoint: string, data: any = null) {
        let responsePromise = svc.executeAsync<T>(endpoint, data);

        let myResponse = responsePromise.then((resp) => {
            return resp;
        }).catch((error) => {
            this.generalErrorEvent.next(error);
            return new Promise<T>(error);
        });

        let response = await myResponse;
        return response;
    }

}
