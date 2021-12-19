import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CreateAccountComponent } from './pages/create-account-page/create-account-page';
import { PageIdEnum } from './pages/page-id';
import { ConfigDataService } from './services/config-data.service';
import { CurrentInstance } from './services/current-instance';
import { UserData } from './user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private configSvc: ConfigDataService
  ) {

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
}


