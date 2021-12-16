import { Injectable } from '@angular/core';
import { ConfigLoaderService } from '../api/account/config-loader.service';
import { UserData } from '../user-data';
import { CookieService } from '../utils/cookie.service';

@Injectable({ providedIn: 'root' })
export class ConfigDataService {
  constructor(
    private configLoaderSvc: ConfigLoaderService,
    private cookieSvc: CookieService
  ) { }

  public readSessionCookie() {
    let sessionCookie = this.cookieSvc.getCookie('session');
    UserData.isLoggedIn = !!sessionCookie;
  }

  public async load() {
    await this.configLoaderSvc.refresh();
    let r = this.configLoaderSvc.response;
    UserData.loginName = r.mail;
  }

}
