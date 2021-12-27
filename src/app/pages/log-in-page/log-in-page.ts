import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AccountApiService } from 'src/app/api/account/account-api.service';
import { LoginRequest } from 'src/app/api/account/account-ints';
import { ConfigDataService } from 'src/app/services/config-data.service';
import { UserData } from 'src/app/user-data';
import { CookieService } from 'src/app/utils/cookie.service';
import { PageIdEnum } from '../page-id';

// import { Geolocation, GeolocationPosition } from '@capacitor/geolocation';

import { Dialog } from '@capacitor/dialog';

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


  // public testStr1 = '';
  // public testStr2 = '';
  // public testStr3 = '';

  // async getCurrentPosition() {
  //   try {
  //     let loc = await Geolocation.getCurrentPosition();
  //     this.testStr3 = loc.timestamp + '-' + (loc.coords ? loc.coords.latitude : '');
  //   } catch (error: any) {
  //     this.testStr3 = error;
  //   }
  // }

  public test() {
    this.accountApiSvc.test();
  }


  public ngOnInit() {

    // let geoExists = !!Geolocation;
    // let methodExists = !!Geolocation.getCurrentPosition;

    // this.testStr1 = geoExists + 'aaa';
    // this.testStr2 = methodExists + 'bbb';

    // Dialog.alert({
    //   title: 'Stop',
    //   message: 'this is an error',
    // });

    // this.getCurrentPosition();


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
