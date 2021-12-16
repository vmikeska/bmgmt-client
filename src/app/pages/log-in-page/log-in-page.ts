import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AccountApiService } from 'src/app/api/account/account-api.service';
import { LoginRequest } from 'src/app/api/account/account-ints';
import { ConfigDataService } from 'src/app/services/config-data.service';
import { UserData } from 'src/app/user-data';
import { CookieService } from 'src/app/utils/cookie.service';
import { PageIdEnum } from '../page-id';

@Component({
  selector: 'app-log-in-page',
  templateUrl: 'log-in-page.html',
  styleUrls: ['log-in-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class LogInPageComponent implements OnInit {
  constructor(
    private accountApiSvc: AccountApiService,
    private router: Router,
    private cookieSvc: CookieService,
    private configSvc: ConfigDataService
  ) { }

  public vm: LoginVM = {
    mail: '',
    password: ''
  };

  public test() {
    this.accountApiSvc.test();
  }

  public ngOnInit() {
    this.configSvc.readSessionCookie();

    if (UserData.isLoggedIn) {
      let url = PageIdEnum.Dashboard;
      this.router.navigate([url]);
    }
  }

  public loginClick() {
    this.sendReqAsync();
  }

  private async sendReqAsync() {
    let req: LoginRequest = {
      mail: this.vm.mail,
      password: this.vm.password
    };

    let successful = await this.accountApiSvc.login(req);

    if (successful) {
      UserData.isLoggedIn = true;
      await this.configSvc.load();
      let url = PageIdEnum.Dashboard;
      this.router.navigate([url]);
    }
  }

  public registerClick() {
    let url = PageIdEnum.NewAccount;
    this.router.navigate([url]);
  }


}

export interface LoginVM {
  mail: string;
  password: string;
}
