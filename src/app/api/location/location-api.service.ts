import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { LocationSearchResponse } from './location-ints';

@Injectable({ providedIn: 'root' })
export class LocationApiService {

  constructor(private restApiSvc: RestApiService) { }

  public async search(str: string) {
    let req = { str };
    let res = await this.restApiSvc.getAsync<LocationSearchResponse[]>('location', req);
    return res;
  }


}
