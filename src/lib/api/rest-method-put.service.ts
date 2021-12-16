
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestMethodBaseService } from './rest-method-base.service';
import { RestSettingsService } from './rest-settings.service';

@Injectable({providedIn: 'root'})
export class RestMethodPutService extends RestMethodBaseService {

    constructor(
        public _http: HttpClient,
        public settingSvc: RestSettingsService
    ) {
        super(_http, settingSvc);
    }

    public async executeAsync<T>(endpoint: string, data: any = null) {
        let url = this.getApiUrl(endpoint);

        let resPromise = this._http.put<T>(url, data, {
            headers: this.addAuthHeader(new HttpHeaders({ 'Content-Type': 'application/json; charset=UTF-8' })),
            withCredentials: this.settingSvc.withCredentials
        }).toPromise();
        return resPromise;
    }
}
