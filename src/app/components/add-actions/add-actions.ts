import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-actions',
  templateUrl: 'add-actions.html',
  styleUrls: ['add-actions.scss']
})

export class AddActionsComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

  @Input()
  public items: AddActionVM[];
}

export interface AddActionVM {
  ico: any;
  txt: () => string;
  callback: () => void;
}
