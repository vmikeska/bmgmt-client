import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { TopicParticipantEnum } from '../api/participant/particip-ints';
import { ProjectApiService } from '../api/project/project-api.service';
import { ProjectDetailResponse } from '../api/project/project-ints';
import { TaskApiService } from '../api/task/task-api.service';
import { ParticipantsOverviewReponse, TaskDetailResponse, TaskTypeEnum } from '../api/task/task-ints';
import { DialogService } from '../dialogs/base/dialog.service';
import { ProjectParticipantDialogComponent } from '../dialogs/participants-dialog/project-participants-dialog';
import { TaskParticipantDialogComponent } from '../dialogs/participants-dialog/task-participants-dialog';
import { TaskToProjDialogComponent } from '../dialogs/task-to-proj-dialog/task-to-proj-dialog';

@Injectable({ providedIn: 'root' })
export class ProjectDetailService {

  constructor(
    private projectApiSvc: ProjectApiService,
    private dlgSvc: DialogService,
  ) {

  }

  public vm: ProjDetailVM;
  public res: ProjectDetailResponse;

  public async reloadAsync(id: string) {
    var res = await this.projectApiSvc.getDetailById(id);
    if (!res) {
      return;
    }

    this.res = res;

    var pr = res.project;

    let adminsCount = this.participantsByType(res.participants, TopicParticipantEnum.Admin);
    let observersCount = this.participantsByType(res.participants, TopicParticipantEnum.Observer);
    let workersCount = this.participantsByType(res.participants, TopicParticipantEnum.Worker);

    this.vm = {
      id: pr.id,
      name: pr.name,
      desc: pr.desc,

      adminsCount,
      observersCount,
      workersCount,

      participantsEditTxt: this.evaluateParticipantsEditTxt(workersCount, observersCount, adminsCount)
    };
  }

  public showEditParticipantsDialog() {
    let dlg = this.dlgSvc.create(ProjectParticipantDialogComponent, (m) => {
      m.topicId = this.vm.id
    });
    var sub = this.dlgSvc.closeClicked.subscribe(async () => {
      await this.reloadAsync(this.vm.id);
      sub.unsubscribe();
    });
  }

  private participantsByType(res: ParticipantsOverviewReponse[], type: TopicParticipantEnum) {
    let group = res.find((i) => { return i.type === type });
    if (!group) {
      return 0;
    }

    return group.count;
  }

  private evaluateParticipantsEditTxt(workersCount: number, observersCount: number, adminsCount: number) {
    let ss: string[] = [];

    if (workersCount) {
      ss.push(`${workersCount} workers`);
    }

    if (observersCount) {
      ss.push(`${observersCount} observers`);
    }

    if (adminsCount) {
      ss.push(`${adminsCount} admins`);
    }

    if (ss.length) {
      return ss.join(', ');
    }

    return 'no participants yet';
  }

}

export interface ProjDetailVM {
  id: string;
  name: string;
  desc: string;

  adminsCount?: number;
  observersCount?: number;
  workersCount?: number;

  participantsEditTxt: string;
}

