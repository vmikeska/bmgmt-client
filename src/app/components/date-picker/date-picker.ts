import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Moment } from 'moment';
import { ItemOption } from 'src/app/ints/common-ints';

@Component({
  selector: 'app-date-picker',
  templateUrl: 'date-picker.html'
})

export class DatePickerComponent implements OnInit {
  constructor() { }

  public ngOnInit() { }

  @Output()
  public change = new EventEmitter<any>();

  @Input()
  public label: string;

  @Input()
  public model: any;

  @Output()
  public modelChange = new EventEmitter<Moment>();

  public innerChangeEvent() {
    this.modelChange.emit(this.model);
    this.change.emit(this.model);
  }

  public dateChange() {

  }
}
