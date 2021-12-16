
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RestMethodBaseService, UrlUtils } from './rest-method-base.service';
import { RestSettingsService } from './rest-settings.service';

@Injectable({providedIn: 'root'})
export class RestMethodDeleteService extends RestMethodBaseService {

    constructor(
        public _http: HttpClient,
        public settingSvc: RestSettingsService
    ) {
        super(_http, settingSvc);
    }

    public async executeAsync<T>(endpoint: string, data: any = null) {

        let urlBase = this.getApiUrl(endpoint);
        let params = data ? UrlUtils.convertJsonToUrlParams(data) : null;

        let url = data ? `${urlBase}?${params}` : urlBase;

        let resPromise = this._http.delete<T>(url, {
            headers: this.addAuthHeader(new HttpHeaders()),
            withCredentials: this.settingSvc.withCredentials
        }).toPromise();
        return resPromise;
    }
}
