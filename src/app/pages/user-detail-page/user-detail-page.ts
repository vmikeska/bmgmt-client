import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { faEnvelope, faGlobeAmericas, faMapMarkerAlt, faPen, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { UserSkillsApiService } from 'src/app/api/tags/user-skills-api.service';
import { UserApiService } from 'src/app/api/user/user-api.service';
import { LocationSaveResponse, UpdatePropRequest, UserResponse } from 'src/app/api/user/user-ints';
import { UrlParamUtils } from 'src/lib/utils/url-utils';
import { PageIdEnum } from '../page-id';

@Component({
  selector: 'app-user-detail-page',
  templateUrl: 'user-detail-page.html',
  styleUrls: ['user-detail-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UserDetailPageComponent implements OnInit {
  constructor(
    private userApiSvc: UserApiService,
    private router: Router,
    private userSkillsApiSvc: UserSkillsApiService
  ) { }

  public activeId: string;

  faPen = faPen;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faGlobeAmericas = faGlobeAmericas;
  faMapMarkerAlt = faMapMarkerAlt;
  faPhone = faPhone;

  public isMe: boolean;

  ngOnInit() {
    this.loadAsync();

    this.isMe = !this.id;

    if (this.isMe) {
      this.activeId = PageIdEnum.UserDetail;
    }
  }

  public vm: UserDetailVM;

  public phoneSaveCallback = async () => {
    let sucessful = await this.updateItem('phone', this.vm.phone);
    return sucessful;
  };

  public mailSaveCallback = async () => {
    let sucessful = await this.updateItem('mail', this.vm.mail);
    return sucessful;
  };

  public websiteSaveCallback = async () => {
    let sucessful = await this.updateItem('website', this.vm.website);
    return sucessful;
  };





  private async updateItem(name: string, value: string) {
    var req: UpdatePropRequest = {
      item: name,
      value: value
    };
    let sucessful = await this.userApiSvc.updateProp(req);
    return sucessful;
  }

  public get id() {
    let id = UrlParamUtils.getUrlParam<string>('id');
    return id;
  }

  public realId: string;

  public async loadAsync() {
    let res: UserResponse;

    if (this.id) {
      res = await this.userApiSvc.getById(this.id);
    } else {
      res = await this.userApiSvc.getLoggedUser();
    }
    this.realId = res.id;

    this.vm = {
      isMe: !this.id,
      fullName: this.getName(res.firstName, res.lastName),
      desc: res.desc,
      mail: res.mail,
      phone: res.phone,
      website: res.website,
      location: res.location
    };

  }

  public userTagsLoadCallback = async (entityId: string) => {
    let items = await this.userSkillsApiSvc.getSaved(entityId);
    return items;
  }

  public editClick() {
    this.redirectToEdit();
  }

  private redirectToEdit() {
    let url = PageIdEnum.UserUpdate;
    this.router.navigate([url]);
  }

  private getName(fn: string, ln: string) {
    if (!fn && !ln) {
      return '[no name listed]'
    }

    return [fn, ln].join(' ');
  }

  public phoneClick() {
    alert('todo: phone');
  }

  public mailClick() {
    alert('todo: mail');
  }

  public websiteClick() {
    alert('todo: website');
  }

  public locationClick() {
    alert('todo: location');
  }
}

export interface UserDetailVM {
  isMe: boolean
  fullName: string;
  desc: string;
  phone: string;
  mail: string;
  website: string;
  location: LocationSaveResponse;
}
