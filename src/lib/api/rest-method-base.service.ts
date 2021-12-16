
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { forOwn } from 'lodash-es';
import { Injectable } from '@angular/core';
import { RestSettingsService } from './rest-settings.service';
import { CommonGlobal } from '../base/common-global';
import { ObjectUtils } from '../utils/object-utils';


@Injectable()
export class RestMethodBaseService {

    constructor(
        public _http: HttpClient,
        public settingSvc: RestSettingsService
    ) { }

    public async executeAsync<T>(endpoint: string, data: any = null): Promise<T | null> {
        return null;
    }

    protected addAuthHeader(httpHeaderObj: HttpHeaders) {

        //just keeping here as an example, how to add anything into the header, but is not used anymore
        //     return httpHeaderObj.append('ONEWEB-USERID', this.globalSvc.environment.userId);

        // return httpHeaderObj.append('Aut', this.globalSvc.environment.userId);

        return httpHeaderObj;
    }

    protected getApiUrl(endpoint: string) {
        //todo: maybe moveto settings service
        const url = `${CommonGlobal.environment.baseApi}${endpoint}`;
        return url;
    }

}

export class UrlUtils {
    public static convertJsonToUrlParams(json: any) {

        let up = new URLSearchParams();

        forOwn(json, (value, key) => {
            if (ObjectUtils.isArray(value)) {
                for (let item of value) {
                    let val = item.toString();
                    up.append(key, val);
                }
            } else {
                if (!ObjectUtils.isNullOrUndefined(value)) {
                    let val = value.toString();
                    up.append(key, val);
                }
            }
        });

        let body = up.toString();
        return body;
    }
}

