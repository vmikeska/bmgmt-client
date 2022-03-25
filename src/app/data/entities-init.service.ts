import { Injectable } from '@angular/core';
import { ProjectChatMessagesEntityOperations, ProjectEntityOperations, ProjectParticipantEntityOperations, ProjectsTaskEntityOperations, TaskChatMessagesEntityOperations, TaskEntityOperations, TaskParticipantEntityOperations, UserEntityOperations, UserSettingsEntityOperations, UserSkillsBindingEntityOperations, UserSkillsTagEntityOperations } from './entity-operations';
import { Storage } from '@capacitor/storage';
import { EntityBase } from './entities/base-enitity';
import { EntityOperationsBase } from './entity-operation-base';

@Injectable({ providedIn: 'root' })
export class EntitiesInitService {

  constructor(
    private projectEntSvc: ProjectEntityOperations,
    private taskEntSvc: TaskEntityOperations,
    private taskParEntSvc: TaskParticipantEntityOperations,
    private projParEntSvc: ProjectParticipantEntityOperations,
    private projTaskEntSvc: ProjectsTaskEntityOperations,
    private projChatEntSvc: ProjectChatMessagesEntityOperations,
    private taskChatEntSvc: TaskChatMessagesEntityOperations,
    private userSetEntSvc: UserSettingsEntityOperations,
    private userEntSvc: UserEntityOperations,
    private userSkillsBindEntSvc: UserSkillsBindingEntityOperations,
    private userSillsTagEntSvc: UserSkillsTagEntityOperations,
  ) { }

  public async initAsync() {

    let allOps: EntityOperationsBase<any>[] = [
      this.projectEntSvc,
      this.taskEntSvc,
      this.taskParEntSvc,
      this.projParEntSvc,
      this.projTaskEntSvc,
      this.userSetEntSvc,
      this.userEntSvc,
      this.userSkillsBindEntSvc,
      this.userSillsTagEntSvc,
      this.projChatEntSvc,
      this.taskChatEntSvc
    ];

    for (let s of allOps) {
      await this.initEntityAsync(s);
    }
  }

  private async initEntityAsync<T extends EntityBase>(op: EntityOperationsBase<T>) {

    let syncer = new LocalSyncer(op);

    await syncer.loadAsync();

    //todo: rather queue

    op.onCreateEvent.subscribe((e) => {
      syncer.save();
    });

    op.onUpdateEvent.subscribe((e) => {
      syncer.save();
    });

    op.onRemoveItem.subscribe((e) => {
      syncer.save();
    });
  }


}

export class LocalSyncer<T extends EntityBase> {

  constructor(private op: EntityOperationsBase<T>) {

  }

  private get colName() {
    return this.op.name;
  }

  public save() {
    let str = JSON.stringify(this.op.list);
    Storage.set({ key: this.colName, value: str });
  }

  public async loadAsync() {
    let r = await Storage.get({ key: this.colName });
    if (r.value) {
      let list = <T[]>JSON.parse(r.value);
      this.op.list = list;
    }
  }
}

export class RemoteSyncer {
  //todo: api
}
