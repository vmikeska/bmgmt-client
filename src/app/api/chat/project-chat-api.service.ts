import { Injectable } from "@angular/core";
import { BaseChatApiService } from "./base-chat-api.service";

@Injectable({ providedIn: 'root' })
export class ProjectChatApiService extends BaseChatApiService {

  public get baseUrl() {
    return 'project-chat';
  }

}
