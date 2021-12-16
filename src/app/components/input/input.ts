import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: 'input.html'
})

export class InputComponent implements OnInit {
  constructor() { }

  public ngOnInit() { }

  @Output()
  public change = new EventEmitter<any>();

  @Input()
  public label: string;

  @Input()
  public type = 'text';

  @Input()
  public model: any;

  @Output()
  public modelChange = new EventEmitter<any>();

  public innerChangeEvent(value: any) {
    this.modelChange.emit(value);
    this.change.emit(value);
  }
}
