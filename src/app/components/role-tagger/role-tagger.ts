import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, ElementRef, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { cloneDeep, pull } from 'lodash-es';
import { TopicParticipantEnum } from 'src/app/api/participant/particip-ints';
import { TopicParticipantEntity } from 'src/app/data/entities/entities';
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

      let results = this.userEntSvc.list.map((u) => {
        let name = `${u.firstName} ${u.lastName}`;
        let item: TagItem = { name, userId: u.id };
        return item;
      });

      this.filteredSearchItems = results;
    });
  }

  public async loadSelectedAsync() {
    let es = this.loadCallback(this.topicId);

    let categoryUsers = es.filter(t => t.role === this.role);

    let tags = categoryUsers.map((i) => {
      let ti: TagItem = {
        name: this.usersSvc.getFullNameByUserId(this.topicId),
        bindingId: i.id,
        userId: i.user_id,
      };
      return ti;
    });
    this.selectedItems = tags;
  }

  public add(event: MatChipInputEvent) { }

  @Input()
  public removeCallback: (item: TagItem) => boolean;

  @Input()
  public addCallback: (userId: string, role: TopicParticipantEnum) => string;

  @Input()
  public loadCallback: (topicId: string) => TopicParticipantEntity[];

  public removeClick(item: TagItem) {
    let deleted = this.removeCallback(item)

    if (deleted) {
      pull(this.selectedItems, item);
    }
  }

  public selected(event: MatAutocompleteSelectedEvent) {
    let userId = event.option.value.userId;

    let bindingId = this.addCallback(userId, this.role);

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
