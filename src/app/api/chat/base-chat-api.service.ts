import { Injectable } from "@angular/core";
import { RestApiService } from "src/lib/api/rest-api.service";
import { ChatMessageResponse, DeleteChatMessageRequest, NewChatMessageRequest } from "./chat-ints";

@Injectable()
export class BaseChatApiService {

  constructor(private restApiSvc: RestApiService) { }

  public get baseUrl() {
    return '';
  }

  public async getMessages(id: string) {
    let req = {
      id
    };

    let url = this.baseUrl;
    let res = await this.restApiSvc.getAsync<ChatMessageResponse[]>(url, req);
    return res;
  }

  public async addMessage(req: NewChatMessageRequest) {
    let url = this.baseUrl;
    let res = await this.restApiSvc.postAsync<string>(url, req);
    return res;
  }

  public async deleteMessage(req: DeleteChatMessageRequest) {
    let url = this.baseUrl;
    let res = await this.restApiSvc.deleteAsync<boolean>(url, req);
    return res;
  }




}
