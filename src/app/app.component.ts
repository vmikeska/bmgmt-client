import { Component, OnInit, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigLoaderService } from './api/account/config-loader.service';
import { DialogService } from './dialogs/base/dialog.service';
import { CreateAccountComponent } from './pages/create-account-page/create-account-page';
import { PageIdEnum } from './pages/page-id';
import { ConfigDataService } from './services/config-data.service';
import { CurrentInstance } from './services/current-instance';
import { DynamicCreationService } from './services/dynamic-creation.service';
import { UserData } from './user-data';
import { CookieService } from './utils/cookie.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(
    private dynamicSvc: DynamicCreationService,
    private router: Router,
    private cookieSvc: CookieService,
    private viewContainer: ViewContainerRef,
    private dlgSvc: DialogService,
    private configSvc: ConfigDataService
  ) {

  }

  public get isLoggedIn() {
    return UserData.isLoggedIn;
  }

  public get loginName() {
    return UserData.loginName;
  }

  public onActivate(instance: any) {
    CurrentInstance.instance = instance;

    let instName = CurrentInstance.instance.constructor.name;
    let isRegPage = instName === CreateAccountComponent.name;

    if (!UserData.isLoggedIn && !isRegPage) {
      let url = PageIdEnum.LogIn;
      this.router.navigate([url]);
    }
  }

  public ngOnInit() {

    this.initAsync();
  }

  private async initAsync() {
    this.configSvc.readSessionCookie();

    if (UserData.isLoggedIn) {
      await this.configSvc.load();
    }
  }

  public logoutClick() {

    this.cookieSvc.deleteCookie('session');
    UserData.isLoggedIn = false;

    let url = PageIdEnum.LogIn;
    this.router.navigate([url]);
  }

}


