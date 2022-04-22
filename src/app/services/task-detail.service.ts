import { Injectable } from '@angular/core';
import { Moment } from 'moment';
import { TopicParticipantEnum } from '../api/participant/particip-ints';
import { TaskTypeEnum } from '../api/task/task-ints';
import { ProjectsTaskEntity, TaskEntity, TaskParticipantEntity } from '../data/entities/entities';
import {
  ProjectEntityOperations, ProjectsTaskEntityOperations, TaskEntityOperations,
  TaskParticipantEntityOperations
} from '../data/entity-operations';
import { DialogService } from '../dialogs/base/dialog.service';
import { TaskParticipantDialogComponent } from '../dialogs/participants-dialog/task-participants-dialog';
import { TaskToProjDialogComponent } from '../dialogs/task-to-proj-dialog/task-to-proj-dialog';

@Injectable({ providedIn: 'root' })
export class TaskDetailService {

  constructor(
    private taskEntSvc: TaskEntityOperations,
    private taskParticipEntSvc: TaskParticipantEntityOperations,
    private projectBindingSvc: ProjectsTaskEntityOperations,
    private projEntSvc: ProjectEntityOperations,
    private dlgSvc: DialogService,
  ) {

  }

  public vm: TaskVM;
  public te: TaskEntity;
  public pes: TaskParticipantEntity[];
  public pb: ProjectsTaskEntity;

  public reload(id: string) {
    this.te = this.taskEntSvc.getById(id);
    if (!this.te) {
      return;
    }

    this.pes = this.taskParticipEntSvc.list.filter(p => p.entity_id === id);
    this.pb = this.projectBindingSvc.list.find(p => p.task_id === id);

    let adminsCount = this.participantsByType(TopicParticipantEnum.Admin);
    let observersCount = this.participantsByType(TopicParticipantEnum.Observer);
    let workersCount = this.participantsByType(TopicParticipantEnum.Worker);

    let projId = '';
    let projName = '';
    let hasProject = !!this.pb;
    if (hasProject) {
      let proj = this.projEntSvc.getById(this.pb.proj_id);
      projName = proj.name;
      projId = proj.id;
    }

    this.vm = {
      id: this.te.id,
      name: this.te.name,
      type: this.te.type,
      manDays: this.te.manDays,
      manHours: this.te.manHours,
      month: this.te.month,
      week: this.te.week,
      year: this.te.year,
      dateFrom: this.te.dateFrom,
      dateTo: this.te.dateTo,

      hasProject,
      projId,
      projName,

      adminsCount,
      observersCount,
      workersCount,

      projectEditTxt: this.evaluateProjectEditTxt(hasProject, projName),
      participantsEditTxt: this.evaluateParticipantsEditTxt(workersCount, observersCount, adminsCount)
    };
  }

  public showEditProjectDialog() {
    let dlg = this.dlgSvc.create(TaskToProjDialogComponent, (m) => {
      m.taskId = this.vm.id;
      m.hasProject = this.vm.hasProject;
    });

    var sub = dlg.instance.selected.subscribe(async () => {
      this.reload(this.vm.id);
      sub.unsubscribe();
      this.dlgSvc.destroy();
    });

  }

  public showEditParticipantsDialog() {
    let dlg = this.dlgSvc.create(TaskParticipantDialogComponent, (m) => {
      m.topicId = this.vm.id
    });
    var sub = this.dlgSvc.closeClicked.subscribe(async () => {
      this.reload(this.vm.id);
      sub.unsubscribe();
    });
  }

  private participantsByType(type: TopicParticipantEnum) {
    let group = this.pes.filter(p => p.role === type);
    return group.length;
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
