import { Injectable } from '@angular/core';
import { RestApiService } from './rest-api.service';
import { Subject } from 'rxjs';


@Injectable()
export class ApiValueService<T> {

    constructor(apiSvc: RestApiService) {
        this.apiSvc = apiSvc;
    }

    protected apiSvc: RestApiService;
    public onResponse = new Subject<T>();
    public response: T;

    protected get url(): string {
        throw new Error('EndpointUrlNotSpecified');
    }

    public async refresh() {
        this.response = await this.getAsync();
        this.onResponse.next(this.response);
    }

    public async getAsync() {
        let res = await this.apiSvc.getAsync<T>(this.url);
        return res;
    }

    public async getValueAsync() {
        return new Promise<T>(async (success) => {

            if (this.response) {
                success(this.response);
            } else {
                await this.refresh();
                success(this.response);
            }
        });
    }
}
