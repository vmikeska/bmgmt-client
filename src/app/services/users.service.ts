import { Injectable } from '@angular/core';
import { UserEntityOperations } from '../data/entity-operations';

@Injectable({providedIn: 'root'})
export class UsersService {
  constructor(
    private userEntSvc: UserEntityOperations
  ) { }

  // public getFirstNameByUserId(userId: string) {
  //   let u = this.userById(userId);
  //   if (!u) {
  //     return 'N/A';
  //   }

  //   return u.lastName;
  // }

  // public getLastNameByUserId(userId: string) {
  //   let u = this.userById(userId);
  //   if (!u) {
  //     return 'N/A';
  //   }

  //   return u.lastName;
  // }

  public getFullNameByUserId(userId: string) {
    let u = this.userById(userId);
    if (!u) {
      //todo: request user download
      return 'N/A';
    }

    return `${u.firstName} ${u.lastName}`;
  }

  private userById(userId: string) {
    let user = this.userEntSvc.getById(userId);
    return user;
  }

}
