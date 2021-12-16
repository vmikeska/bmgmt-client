import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Moment } from 'moment';
import { TopicParticipantEnum } from '../api/participant/particip-ints';
import { TaskApiService } from '../api/task/task-api.service';
import { ParticipantsOverviewReponse, TaskDetailResponse, TaskTypeEnum } from '../api/task/task-ints';
import { DialogService } from '../dialogs/base/dialog.service';
import { ProjectParticipantDialogComponent } from '../dialogs/participants-dialog/project-participants-dialog';
import { TaskParticipantDialogComponent } from '../dialogs/participants-dialog/task-participants-dialog';
import { TaskToProjDialogComponent } from '../dialogs/task-to-proj-dialog/task-to-proj-dialog';

@Injectable({ providedIn: 'root' })
export class TaskDetailService {

  constructor(
    private taskApiSvc: TaskApiService,
    private dlgSvc: DialogService,
  ) {

  }

  public vm: TaskVM;
  public res: TaskDetailResponse;

  public async reloadAsync(id: string) {
    var res = await this.taskApiSvc.getDetailById(id);
    if (!res) {
      return;
    }

    this.res = res;

    var tr = res.task;

    let adminsCount = this.participantsByType(res.participants, TopicParticipantEnum.Admin);
    let observersCount = this.participantsByType(res.participants, TopicParticipantEnum.Observer);
    let workersCount = this.participantsByType(res.participants, TopicParticipantEnum.Worker);

    this.vm = {
      id: tr.id,
      name: tr.name,
      type: tr.type,
      manDays: tr.manDays,
      manHours: tr.manHours,
      month: tr.month,
      week: tr.week,
      year: tr.year,
      dateFrom: moment.utc(tr.dateFrom),
      dateTo: moment.utc(tr.dateTo),

      hasProject: res.projectBinding.hasProject,
      projId: tr.projId,
      projName: res.projectBinding.projName,

      adminsCount,
      observersCount,
      workersCount,

      projectEditTxt: this.evaluateProjectEditTxt(this.res.projectBinding.hasProject, this.res.projectBinding.projName),
      participantsEditTxt: this.evaluateParticipantsEditTxt(workersCount, observersCount, adminsCount)
    };
  }

  public showEditProjectDialog() {
    let dlg = this.dlgSvc.create(TaskToProjDialogComponent, (m) => {
      m.taskId = this.vm.id;
      m.hasProject = this.vm.hasProject;
    });

    var sub = dlg.instance.selected.subscribe(async () => {
      await this.reloadAsync(this.vm.id);
      sub.unsubscribe();
      this.dlgSvc.destroy();
    });

  }

  public showEditParticipantsDialog() {
    let dlg = this.dlgSvc.create(TaskParticipantDialogComponent, (m) => {
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

  private evaluateProjectEditTxt(hasProject: boolean, projName: string) {
    if (hasProject) {
      return `Project: ${projName}`;
    } else {
      return 'No project assigned';
    }
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

export interface TaskVM {
  id: string;
  name: string;
  type: TaskTypeEnum;

  dateFrom?: Moment;
  dateTo?: Moment;
  week?: number;
  year?: number;
  month?: number;

  manHours?: number;
  manDays?: number;

  hasProject?: boolean;
  projId?: string;
  projName?: string;

  adminsCount?: number;
  observersCount?: number;
  workersCount?: number;

  projectEditTxt: string;

  participantsEditTxt: string;
}
