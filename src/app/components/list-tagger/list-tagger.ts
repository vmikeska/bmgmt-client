import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { pull } from 'lodash';
import { TagBindingResponse, TagResponse } from 'src/app/api/tags/tags-ints';


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

  public options: TagResponse[] = [];

  public tags: TagBindingResponse[] = [];

  @Input()
  public entityId: string;

  public isOpened = true;

  private async initItemsAsync() {
    this.tags = await this.loadCallback(this.entityId);
  }

  @Input()
  public emptyPlaceholder: string;

  @Input()
  public editable = true;

  @Input()
  public removeCallback: (item: TagBindingResponse) => Promise<boolean>;

  @Input()
  public addCallback: (tagId: string, entityId: string) => Promise<string>;

  @Input()
  public loadCallback: (entityId: string) => Promise<TagBindingResponse[]>;

  @Input()
  public searchCallback: (str: string, entityId: string) => Promise<TagResponse[]>;

  public async removeClick(item: TagBindingResponse) {
    let deleted = await this.removeCallback(item);

    if (deleted) {
      pull(this.tags, item);
    }
  }

  public async optionClick(option: TagResponse) {
    let bindingId = await this.addCallback(option.id, this.entityId);

    let newTag: TagBindingResponse = {
      bindingId,
      name: option.name,
      tagId: option.id
    };

    this.tags.push(newTag);

    this.isOpened = false;
    this.search = '';
  }

  public async searchChange() {
    let res = await this.searchCallback(this.search, this.entityId);
    this.options = res;
    if (this.options.length) {
      this.isOpened = true;
    }
  }

}
