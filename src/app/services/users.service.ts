import { Injectable } from '@angular/core';

@Injectable({providedIn: 'root'})
export class UsersService {
  constructor() { }

  public getNameByUserId(userId: string) {
    return 'todo';
  }

  public getSurnameByUserId(userId: string) {
    return 'todo';
  }

}
