import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { UserEntity, UserSkillsTagEntity } from './data/entities/entities';
import { UserEntityOperations, UserSkillsBindingEntityOperations, UserSkillsTagEntityOperations } from './data/entity-operations';
import { CreateAccountComponent } from './pages/create-account-page/create-account-page';
import { PageIdEnum } from './pages/page-id';
import { ConfigDataService } from './services/config-data.service';
import { CurrentInstance } from './services/current-instance';
import { MainInitService } from './services/main-init.service';
import { UserData } from './user-data';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  constructor(
    private router: Router,
    private configSvc: ConfigDataService,
    public mainInitSvc: MainInitService,

    private userEntSvc: UserEntityOperations,
    private userTagsEntSvc: UserSkillsTagEntityOperations,
    private usbeo: UserSkillsBindingEntityOperations

  ) {

  }

  public initialized = false;

  public onActivate(instance: any) {
    CurrentInstance.instance = instance;

    let instName = CurrentInstance.instance.constructor.name;
    let isRegPage = instName === CreateAccountComponent.name;

    // if (!UserData.isLoggedIn && !isRegPage) {
    //   let url = PageIdEnum.LogIn;
    //   this.router.navigate([url]);
    // }
  }

  public ngOnInit() {
    this.initAsync();

  }

  private async initAsync() {
    this.configSvc.readSessionCookie();
    await this.mainInitSvc.initAsync();

    this.initialized = true;
    // if (UserData.isLoggedIn) {
    //   await this.configSvc.load();
    // }

    // this.fillTempUsers();
    //  this.fillUserTags();
    console.log(this.usbeo.list);
  }

  private fillUserTags() {
    let us: UserSkillsTagEntity[] = [
      {
        name: 'Zednik'
      },
      {
        name: 'Obrabec'
      },
      {
        name: 'Dlazdic'
      },
      {
        name: 'Tesar'
      },
      {
        name: 'Helfer'
      },
      {
        name: 'Vodak'
      },
    ];
    us.forEach(u => this.userTagsEntSvc.create(u));
  }

  private fillTempUsers() {
    let us: UserEntity[] = [
      {
        firstName: 'First',
        lastName: 'Lastovic',
        mail: 'm1@asfdsf.com',
      },
      {
        firstName: 'Tomas',
        lastName: 'Jadran',
        mail: 'm2@asfdsf.com',
      },
      {
        firstName: 'Pavel',
        lastName: 'Kalivoda',
        mail: 'm3@asfdsf.com',
      },
      {
        firstName: 'Bruce',
        lastName: 'Spencer',
        mail: 'm4@asfdsf.com',
      },
      {
        firstName: 'Jeronym',
        lastName: 'Jouda',
        mail: 'm5@asfdsf.com',
      }
    ];
    us.forEach(u => this.userEntSvc.create(u));
  }

}





