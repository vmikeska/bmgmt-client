import { Injectable } from '@angular/core';
import { BaseTagsApiService } from './base-tags-api.service';

@Injectable({ providedIn: 'root' })
export class UserSkillsApiService extends BaseTagsApiService {

  public get baseApi() {
    return 'user-skills';
  }

}
