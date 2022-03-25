import { Injectable } from "@angular/core";
import { pull } from "lodash-es";
import { Subject } from "rxjs";
import { StringUtils } from "src/lib/utils/string-utils";
import { EntityBase } from "./entities/base-enitity";
import { NewId } from "./new-id";

@Injectable()
export class EntityOperationsBase<T extends EntityBase> {

  public list: T[] = [];

  public get ulist() {
    return this.list.filter(i => !i.deleted);
  }

  public onCreateEvent = new Subject<T>();
  public onUpdateEvent = new Subject<T>();
  public onRemoveItem = new Subject<T>();

  public get fullName() {
    return '';
  }

  public get name() {
    let c = StringUtils.replaceAll(this.fullName, 'Entity', '');
    return c;
  }

  public getById(id: string) {
    let item = this.list.find(i => i.id === id);
    return item;
  }

  public getByFind(filter: (item: T) => boolean) {
    let e = this.list.find(i => filter(i));
    return e;
  }

  public getByFilter(filter: (item: T) => boolean) {
    let es = this.list.filter(i => filter(i));
    return es;
  }

  private getNewId() {
    return NewId.get();
  }

  public create(e: T) {

    if (!e.id) {
      let id = this.getNewId();
      e.id = id;
    }
    e.synced = false;

    this.list.push(e);
    this.onCreateEvent.next(e);
    return e;
  }

  public updateById(e: T) {
    let newList = this.list.map(i => {
      let replacedItem = i.id === e.id;
      if (replacedItem) {
        return e;
      }
      return i;
    });

    this.list = newList;
    this.markEntityAsUpdated(e);
  }

  public markEntityAsUpdated(e: T) {
    e.synced = false;
    this.onUpdateEvent.next(e);
  }

  public delete(removedItem: T) {
    if (!removedItem) {
      return null;
    }

    if (!removedItem.synced) {
      pull(this.list, removedItem);
    } else {
      removedItem.deleted = true;
      removedItem.synced = false;
    }

    this.onRemoveItem.next(removedItem);
    return removedItem;
  }

  public deleteById(id: string) {
    let removedItem = this.list.find(i => i.id === id);
    let r = this.delete(removedItem);
    return r;
  }

  public deleteByFind(filter: (item: T) => boolean) {
    let removedItem = this.list.find(i => filter(i));
    let r = this.delete(removedItem);
    return r;
  }
}
