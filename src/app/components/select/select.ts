import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ItemOption } from 'src/app/ints/common-ints';

@Component({
  selector: 'app-select',
  templateUrl: 'select.html'
})

export class SelectComponent implements OnInit {
  constructor() { }

  public ngOnInit() { }

  @Output()
  public change = new EventEmitter<any>();

  @Input()
  public label: string;

  @Input()
  public model: any;

  @Output()
  public modelChange = new EventEmitter<any>();

  @Input()
  public opts: ItemOption[] = [];

  public innerChangeEvent() {
    this.modelChange.emit(this.model);
    this.change.emit(this.model);
  }
}
