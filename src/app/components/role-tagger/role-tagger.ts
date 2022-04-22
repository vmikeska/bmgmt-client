import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { cloneDeep, pull } from 'lodash-es';
import { TopicParticipantEnum } from 'src/app/api/participant/particip-ints';
import { TagBaseEntity, TopicParticipantEntity } from 'src/app/data/entities/entities';
import { UserEntityOperations } from 'src/app/data/entity-operations';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-role-tagger',
  templateUrl: 'role-tagger.html',
  styleUrls: ['role-tagger.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RoleTaggerComponent implements OnInit {
  constructor(
    private usersSvc: UsersService,
    private userEntSvc: UserEntityOperations
  ) { }

  @Input()
  public role: TopicParticipantEnum;

  @Input()
  public topicId: string;

  public ngOnInit() {

  }

  @Input()
  public loadCallback: (topicId: string, role: TopicParticipantEnum) => TopicParticipantEntity[];

  @Input()
  public removeCallback: (userId: string) => boolean;

  @Input()
  public addCallback: (userId: string, role: TopicParticipantEnum) => string;


  public userTagsLoadCallback = (entityId: string) => {
    //hack, faking the entity
    let es = this.loadCallback(entityId, this.role);
    let fes = es.map(i => {
      let name = this.usersSvc.getFullNameByUserId(i.tag_id);;
      let e: TagBaseEntity = {
        id: i.tag_id,
        name
      };
      return e;
    });

    return fes;
  }

  public userTagsRemoveCallback = (item: TagBaseEntity) => {
    let userId = item.id;
    this.removeCallback(userId);
  }

  public userTagsAddCallback = (userId: string, entityId: string) => {
    let id = this.addCallback(userId, this.role);
    return id;
  }



  public userTagsSearchCallback = (str: string, entityId: string) => {
    let sstr = str.toLowerCase();

    let items = this.userEntSvc.getByFilter(i => {
      let firstName = i.firstName ? i.firstName.toLowerCase() : '';
      let lastName = i.lastName ? i.lastName.toLowerCase() : '';

      let matches = firstName.includes(sstr) || lastName.includes(sstr);
      return matches;
    });

    //hack, faking the entity
    let results = items.map((u) => {
      let name = `${u.firstName} ${u.lastName}`;
      let item: TagBaseEntity = { name, id: u.id };
      return item;
    });

    return results;
  }







}


export interface TagItem {
  name: string;
  bindingId?: string;
  userId: string;
}
