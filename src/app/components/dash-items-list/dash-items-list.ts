import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dash-items-list',
  templateUrl: 'dash-items-list.html',
  styleUrls: ['dash-items-list.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DashItemsListComponent implements OnInit {
  constructor() { }

  @Input()
  public items: DashListItem[];

  @Output()
  public itemClickEvent = new EventEmitter<string>();

  ngOnInit() { }

  public itemClick(item: DashListItem) {
    this.itemClickEvent.emit(item.id);
  }
}

export interface DashListItem {
  id: string;
  name: string;
  info?: string;
}
