import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { pull } from 'lodash';
import { TagBaseEntity } from 'src/app/data/entities/entities';


@Component({
  selector: 'app-list-tagger',
  templateUrl: 'list-tagger.html',
  styleUrls: ['list-tagger.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ListTaggerComponent implements OnInit {
  constructor(

  ) { }

  faTimes = faTimes;

  public ngOnInit() {
    this.initItemsAsync();
  }

  public get showPlaceholder() {
    return !this.tags.length;
  }

  public search = '';

  public options: TagBaseEntity[] = [];

  public tags: TagBaseEntity[] = [];

  @Input()
  public entityId: string;

  public isOpened = true;

  private initItemsAsync() {
    this.tags = this.loadCallback(this.entityId);
  }

  @Input()
  public emptyPlaceholder: string;

  @Input()
  public editable = true;

  @Input()
  public removeCallback: (item: TagBaseEntity) => void;

  @Input()
  public addCallback: (tagId: string, entityId: string) => string;

  @Input()
  public loadCallback: (entityId: string) => TagBaseEntity[];

  @Input()
  public searchCallback: (str: string, entityId: string) => TagBaseEntity[];

  public removeClick(item: TagBaseEntity) {
    this.removeCallback(item);
    pull(this.tags, item);
  }

  public optionClick(option: TagBaseEntity) {
    let bindingId = this.addCallback(option.id, this.entityId);

    this.tags.push(option);

    this.isOpened = false;
    this.search = '';
  }

  public async searchChange() {
    let es = this.searchCallback(this.search, this.entityId);
    this.options = es;
    if (this.options.length) {
      this.isOpened = true;
    }
  }

}

export interface TagResponse {
  id: string;
  name: string;
}
