import { Injectable } from '@angular/core';
import { UserData } from '../user-data';
import { CookieService } from '../utils/cookie.service';

@Injectable({ providedIn: 'root' })
export class ConfigDataService {
  constructor(

    private cookieSvc: CookieService
  ) { }

  public readSessionCookie() {
    let sessionCookie = this.cookieSvc.getCookie('session');
    UserData.isLoggedIn = !!sessionCookie;
  }

  public async load() {

    UserData.loginName = 'todo: mail';
  }

}
