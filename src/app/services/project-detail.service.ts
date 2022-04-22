import { Injectable } from '@angular/core';
import { TopicParticipantEnum } from '../api/participant/particip-ints';
import { ProjectEntity } from '../data/entities/entities';
import { ProjectEntityOperations, ProjectParticipantEntityOperations } from '../data/entity-operations';
import { DialogService } from '../dialogs/base/dialog.service';
import { ProjectParticipantDialogComponent } from '../dialogs/participants-dialog/project-participants-dialog';

@Injectable({ providedIn: 'root' })
export class ProjectDetailService {

  constructor(
    private projEntSvc: ProjectEntityOperations,
    private projParEntSvc: ProjectParticipantEntityOperations,
    private dlgSvc: DialogService,
  ) {

  }

  public vm: ProjDetailVM;

  public reload(id: string) {
    var e = this.projEntSvc.getById(id);
    if (!e) {
      return;
    }

    let participBindings = this.projParEntSvc.getByFilter(i => i.entity_id === id);

    let adminsCount = 0;
    let observersCount = 0;
    let workersCount = 0;

    for (let b of participBindings) {
      if (b.role === TopicParticipantEnum.Admin) {
        adminsCount++;
      }
      if (b.role === TopicParticipantEnum.Observer) {
        observersCount++;
      }
      if (b.role === TopicParticipantEnum.Worker) {
        workersCount++;
      }
    }

    this.vm = {
      e,

      adminsCount,
      observersCount,
      workersCount,

      participantsEditTxt: this.evaluateParticipantsEditTxt(workersCount, observersCount, adminsCount)
    };
  }

  public showEditParticipantsDialog() {
    let dlg = this.dlgSvc.create(ProjectParticipantDialogComponent, (m) => {
      m.topicId = this.vm.e.id;
    });
    var sub = this.dlgSvc.closeClicked.subscribe(() => {
      this.reload(this.vm.e.id);
      sub.unsubscribe();
    });
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
  e: ProjectEntity;

  adminsCount?: number;
  observersCount?: number;
  workersCount?: number;

  participantsEditTxt: string;
}

