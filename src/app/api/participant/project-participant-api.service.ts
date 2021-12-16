import { Injectable } from '@angular/core';
import { BaseParticipantApiService } from './base-participant-api.service';

@Injectable({ providedIn: 'root' })
export class ProjectParticipantApiService extends BaseParticipantApiService {

  public get baseUrl() {
    return 'project-participant';
  }


}
