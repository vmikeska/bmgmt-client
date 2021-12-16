import { Injectable } from '@angular/core';
import { RestApiService } from 'src/lib/api/rest-api.service';
import { TopicNewParticipantRequest, TopicParticipantResponse } from './particip-ints';

@Injectable({ providedIn: 'root' })
export class BaseParticipantApiService {

  constructor(private restApiSvc: RestApiService) { }

  public get baseUrl() {
    return '';
  }

  public async remove(bindingId: string) {
    let req = {
      bindingId
    };

    let res = await this.restApiSvc.deleteAsync<boolean>(this.baseUrl, req);
    return res;
  }

  public async getList(topicId: string) {
    let req = {
      topicId
    };

    let res = await this.restApiSvc.getAsync<TopicParticipantResponse[]>(this.baseUrl, req);
    return res;
  }

  public async add(req: TopicNewParticipantRequest) {
    let res = await this.restApiSvc.postAsync<string>(this.baseUrl, req);
    return res;
  }


}
