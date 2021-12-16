import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { NewTagBindingResponse, SearchTagResponse, TagBindingResponse } from 'src/app/api/tags/tags-ints';
import { UserSkillsApiService } from 'src/app/api/tags/user-skills-api.service';
import { UserApiService } from 'src/app/api/user/user-api.service';
import { LocationSaveResponse, UserRequest } from 'src/app/api/user/user-ints';

@Component({
  selector: 'app-user-update-page',
  templateUrl: 'user-update-page.html',
  styleUrls: ['user-update-page.scss']
})

export class UserUpdatePageComponent implements OnInit {
  constructor(
    private userApiSvc: UserApiService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userSkillsApiSvc: UserSkillsApiService
  ) { }

  public vm: UserVM;

  faSave = faSave;

  public initialized = false;

  public addressFormControl = new FormControl();

  public ngOnInit() {
    this.initAsync();

    this.addressFormControl.valueChanges.subscribe((v) => {
        console.log(v);
    });
  }

  public updateClick() {
    this.sendUpdateAsync();
  }

  private async initAsync() {
    let res = await this.userApiSvc.getLoggedUser();
    this.vm = {
      id: res.id,
      firstName: res.firstName,
      lastName: res.lastName,
      desc: res.desc,
      phone: res.phone,
      mail: res.mail,
      website: res.website
    };

    this.addressFormControl.setValue(res.location);

    this.initialized = true;
  }

  private async sendUpdateAsync() {
    let req: UserRequest = {
      firstName: this.vm.firstName,
      lastName: this.vm.lastName,
      desc: this.vm.desc,
      mail: this.vm.mail,
      phone: this.vm.phone,
      website: this.vm.website,
      location: this.addressFormControl.value
    };

    await this.userApiSvc.update(req);

    this.snackBar.open('User updated', 'close');
  }

  public userTagsRemoveCallback = async (item: TagBindingResponse) => {
    let removed = await this.userSkillsApiSvc.remove(item.bindingId);
    return removed;
  }

  public userTagsAddCallback = async (tagId: string) => {
    let req: NewTagBindingResponse = {
      tagId,
      entityId: this.vm.id
    };
    let bindingId = await this.userSkillsApiSvc.add(req);
    return bindingId;
  }

  public userTagsLoadCallback = async (entityId: string) => {
    let items = await this.userSkillsApiSvc.getSaved(entityId);
    return items;
  }

  public userTagsSearchCallback = async (str: string) => {
    let req: SearchTagResponse = {
      str,
      entityId: this.vm.id
    };

    let items = await this.userSkillsApiSvc.searchTags(req);
    return items;
  }

}

export class UserVM {
  id: string;
  firstName: string;
  lastName: string;
  desc: string;
  phone: string;
  mail: string;
  website: string;
  location?: LocationSaveResponse;
}
