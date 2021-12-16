import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { cloneDeep, pull } from 'lodash';
import { TopicParticipantEnum, TopicParticipantResponse } from 'src/app/api/participant/particip-ints';
import { UserApiService } from 'src/app/api/user/user-api.service';

@Component({
  selector: 'app-role-tagger',
  templateUrl: 'role-tagger.html',
  styleUrls: ['role-tagger.scss'],
  encapsulation: ViewEncapsulation.None
})

export class RoleTaggerComponent implements OnInit {
  constructor(
    private userApiSvc: UserApiService,
  ) { }

  @Input()
  public role: TopicParticipantEnum;

  @Input()
  public topicId: string;

  public ngOnInit() {
    this.subscribeSearch();
    this.loadSelectedAsync();
  }

  public filterInputFormControl = new FormControl();
  public filteredSearchItems: TagItem[] = [];

  separatorKeysCodes: number[] = [ENTER, COMMA];

  selectedItems: TagItem[] = [];

  @ViewChild('searchInput')
  public searchInput: ElementRef<HTMLInputElement>;

  public subscribeSearch() {
    this.filterInputFormControl.valueChanges.subscribe(async (s) => {

      let us = await this.userApiSvc.find(s);

      let results = us.map((u) => {
        let name = `${u.firstName} ${u.lastName}`;
        let item: TagItem = { name, userId: u.id };
        return item;
      });

      this.filteredSearchItems = results;
    });
  }

  public async loadSelectedAsync() {
    let res = await this.loadCallback(this.topicId);

    let categoryUsers = res.filter(t => t.role === this.role);

    let tags = categoryUsers.map((i) => {
      let ti: TagItem = {
        name: `${i.firstName} ${i.lastName}`,
        bindingId: i.bindingId,
        userId: i.userId,
      };
      return ti;
    });
    this.selectedItems = tags;
  }

  public add(event: MatChipInputEvent) { }

  @Input()
  public removeCallback: (item: TagItem) => Promise<boolean>;

  @Input()
  public addCallback: (userId: string, role: TopicParticipantEnum) => Promise<string>;

  @Input()
  public loadCallback: (topicId: string) => Promise<TopicParticipantResponse[]>;

  public async removeClick(item: TagItem) {
    let deleted = await this.removeCallback(item)

    if (deleted) {
      pull(this.selectedItems, item);
    }
  }

  public async selected(event: MatAutocompleteSelectedEvent) {
    let userId = event.option.value.userId;

    let bindingId = await this.addCallback(userId, this.role);

    let tag: TagItem = cloneDeep(event.option.value);
    tag.bindingId = bindingId;

    this.selectedItems.push(tag);

    this.searchInput.nativeElement.value = '';
    this.filterInputFormControl.setValue(null);
  }
}


export interface TagItem {
  name: string;
  bindingId?: string;
  userId: string;
}
