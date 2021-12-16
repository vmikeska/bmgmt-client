import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { NewTagBindingResponse, SearchTagResponse, TagBindingResponse, TagResponse } from './tags-ints';

@Injectable()
export class BaseTagsApiService {

  constructor(public restApiSvc: RestApiService) { }

  public get baseApi() {
    return 'overwrite';
  }

  public async getSaved(entityId: string) {
    let req = {
      entityId
    };

    let url = `${this.baseApi}`;

    let res = await this.restApiSvc.getAsync<TagBindingResponse[]>(url, req);
    return res;
  }

  public async add(req: NewTagBindingResponse) {

    let url = `${this.baseApi}`;

    let res = await this.restApiSvc.postAsync<string>(url, req);
    return res;
  }

  public async remove(bindingId: string) {

    let req = { bindingId };
    let url = `${this.baseApi}`;

    let res = await this.restApiSvc.deleteAsync<boolean>(url, req);
    return res;
  }

  public async searchTags(req: SearchTagResponse) {
    let url = `${this.baseApi}/list`;

    let res = await this.restApiSvc.getAsync<TagResponse[]>(url, req);
    return res;
  }



}
