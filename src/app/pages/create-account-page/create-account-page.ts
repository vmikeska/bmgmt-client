import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { AccountApiService } from 'src/app/api/account/account-api.service';
import { NewAccountRequest } from 'src/app/api/account/account-ints';
import { UserData } from 'src/app/user-data';
import { PageIdEnum } from '../page-id';

@Component({
  selector: 'app-create-account-page',
  templateUrl: 'create-account-page.html',
  styleUrls: ['create-account-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CreateAccountComponent implements OnInit {
  constructor(
    private accountApiSvc: AccountApiService,
    private router: Router
  ) { }

  public mail = '';
  public password = '';

  ngOnInit() { }

  public createClick() {
    this.sendReqAsync();
  }

  private async sendReqAsync() {
    let req: NewAccountRequest = {
      mail: this.mail,
      password: this.password
    };

    UserData.isLoggedIn = true;

    await this.accountApiSvc.create(req);

    let url = PageIdEnum.Dashboard;
    this.router.navigate([url]);
  }

  public loginClick() {
    let url = PageIdEnum.LogIn;
    this.router.navigate([url]);
  }


}

