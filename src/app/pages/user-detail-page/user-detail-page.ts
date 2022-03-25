import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faEnvelope, faGlobeAmericas, faMapMarkerAlt, faPen, faPhone, faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import { isLength } from 'lodash-es';
import { NewTagBindingResponse, SearchTagResponse, TagBindingResponse } from 'src/app/api/tags/tags-ints';
import { LocationSaveResponse } from 'src/app/api/user/user-ints';
import { TagBaseEntity, TagBindingBaseEntity, UserSkillsBindingEntity } from 'src/app/data/entities/entities';
import { UserEntityOperations, UserSkillsBindingEntityOperations, UserSkillsTagEntityOperations } from 'src/app/data/entity-operations';
import { UserService } from 'src/app/services/user.service';
import { UsersService } from 'src/app/services/users.service';
import { UserData } from 'src/app/user-data';
import { CookieService } from 'src/app/utils/cookie.service';
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
    private router: Router,
    private cookieSvc: CookieService,
    private userEntSvc: UserEntityOperations,
    private usersSvc: UsersService,
    private userSvc: UserService,
    private userSkillsBindEntSvc: UserSkillsBindingEntityOperations,
    private userSkillsTagEntSvc: UserSkillsTagEntityOperations,
  ) { }

  public activeId: string;

  faPen = faPen;
  faUser = faUser;
  faEnvelope = faEnvelope;
  faGlobeAmericas = faGlobeAmericas;
  faMapMarkerAlt = faMapMarkerAlt;
  faPhone = faPhone;
  faSignOutAlt = faSignOutAlt;

  public isMe: boolean;

  public addressFormControl = new FormControl();

  ngOnInit() {
    this.load();

    this.isMe = !this.id;

    if (this.isMe) {
      this.activeId = PageIdEnum.UserDetail;
    }
  }

  public vm: UserDetailVM;

  public phoneSaveCallback = () => {
    let user = this.userEntSvc.getById(this.realId);
    user.phone = this.vm.phone;
    this.userEntSvc.updateById(user);
  };

  public mailSaveCallback = () => {
    let user = this.userEntSvc.getById(this.realId);
    user.mail = this.vm.mail;
    this.userEntSvc.updateById(user);
  };

  public websiteSaveCallback = () => {
    let user = this.userEntSvc.getById(this.realId);
    user.website = this.vm.website;
    this.userEntSvc.updateById(user);
  };

  public firstNameSaveCallback = () => {
    let user = this.userEntSvc.getById(this.realId);
    user.firstName = this.vm.firstName;
    this.userEntSvc.updateById(user);

    this.vm.fullName = this.usersSvc.getFullNameByUserId(this.realId);
  };

  public lastNameSaveCallback = () => {
    let user = this.userEntSvc.getById(this.realId);
    user.lastName = this.vm.lastName;
    this.userEntSvc.updateById(user);

    this.vm.fullName = this.usersSvc.getFullNameByUserId(this.realId);
  };

  public descSaveCallback = () => {
    let user = this.userEntSvc.getById(this.realId);
    user.desc = this.vm.desc;
    this.userEntSvc.updateById(user);
  };

  public locationSaveCallback = () => {
    let fcv = <LocationSaveResponse>this.addressFormControl.value;
    let task = this.userEntSvc.getById(this.realId);
    task.location = {
      text: fcv.text,
      coords: fcv.coords
    };
    this.userEntSvc.updateById(task);
    this.vm.location = fcv.text;
  };

  public get id() {
    let id = UrlParamUtils.getUrlParam<string>('id');
    return id;
  }

  public realId: string;

  public load() {

    this.realId = this.id ? this.id : this.userSvc.id;
    let e = this.userEntSvc.getById(this.realId);

    //todo: load other users if not here
    if (e) {
      this.vm = {
        isMe: !this.id,
        firstName: e.firstName,
        lastName: e.lastName,
        fullName: this.getName(e.firstName, e.lastName),
        desc: e.desc,
        mail: e.mail,
        phone: e.phone,
        website: e.website,
        location: e.location ? e.location.text : ''
      };
    }

    this.addressFormControl.setValue(e.location);
  }

  public userTagsRemoveCallback = (item: TagBaseEntity) => {
    this.userSkillsBindEntSvc.deleteByFind(i => i.tag_id === item.id);
  }

  public userTagsAddCallback = (tagId: string, entityId: string) => {
    let e: UserSkillsBindingEntity = {
      tag_id: tagId,
      entity_id: entityId
    };

    let be = this.userSkillsBindEntSvc.create(e);
    return be.id;
  }

  public userTagsLoadCallback = (entityId: string) => {
    let bs = this.userSkillsBindEntSvc.ulist.filter(i => i.entity_id === entityId);

    let tags = bs.map(b => {
      let tag = <TagBaseEntity>this.userSkillsTagEntSvc.getById(b.tag_id);
      if (tag) {
        return tag;
      }

      let btag: TagBaseEntity = {
        name: 'N/A',
        id: b.tag_id
      };
      return btag;
    });


    return tags;
  }

  public userTagsSearchCallback = (str: string, entityId: string) => {
    let e = this.userSkillsTagEntSvc.ulist.filter(i => i.name.toLowerCase().includes(str.toLowerCase()));
    return e;
  }

  private getName(fn: string, ln: string) {
    if (!fn && !ln) {
      return 'no name listed'
    }

    return [fn, ln].join(' ');
  }

  public logoutClick() {
    this.cookieSvc.deleteCookie('session');
    UserData.isLoggedIn = false;

    let url = PageIdEnum.LogIn;
    this.router.navigate([url]);
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
  firstName: string;
  lastName: string;
  fullName: string;
  desc: string;
  phone: string;
  mail: string;
  website: string;
  location: string;
}
