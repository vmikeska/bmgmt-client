import { Injectable } from '@angular/core';
import { ProjectEntityOperations, TaskEntityOperations } from './entity-operations';
import { Storage } from '@capacitor/storage';
import { EntityBase } from './entities/base-enitity';
import { EntityOperationsBase } from './entity-operation-base';

@Injectable({ providedIn: 'root' })
export class EntitiesInitService {

  constructor(
    private projectEntSvc: ProjectEntityOperations,
    private taskEntSvc: TaskEntityOperations
  ) { }


  public async initAsync() {
    await this.initEntityAsync(this.projectEntSvc);
    await this.initEntityAsync(this.taskEntSvc);
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
