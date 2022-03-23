import { Injectable } from '@angular/core';
import { UserEntity } from '../data/entities/entities';
import { UserEntityOperations } from '../data/entity-operations';
import { NewId } from '../data/new-id';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(
    private userEntSvc: UserEntityOperations
  ) { }

  public init() {
    let hasUser = !!this.user;
    if (!hasUser) {

      let e: UserEntity = {
        id: NewId.get(),
        firstName: '',
        lastName: '',
        desc: '',
        fields: [],
        location: null,
        mail: '',
        phone: '',
        website: ''
      };

      this.userEntSvc.create(e);
    }
  }

  public get id() {
    if (this.user) {
      return this.user.id;
    }

    return null;
  }

  public get user() {
    if (this.userEntSvc.list.length) {
      return this.userEntSvc.list[0];
    }

    return null;
  }

  public fullName = 'todo: Vaclav Mikeska';

}
