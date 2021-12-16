import { Injectable } from "@angular/core";
import { BaseChatApiService } from "./base-chat-api.service";

@Injectable({ providedIn: 'root' })
export class TaskChatApiService extends BaseChatApiService {

  public get baseUrl() {
    return 'task-chat';
  }

}
