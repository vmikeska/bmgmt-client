import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-people-filter',
  templateUrl: 'people-filter.html',
  styleUrls: ['people-filter.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PeopleFilterComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

  public items: FilterItem[] = [
    {
      name: 'Me'
    },
    {
      name: 'Karlol Woytyla'
    },
    {
      name: 'Johnny Mnemonic'
    }
  ];

}

export interface FilterItem {
  name: string;
}
