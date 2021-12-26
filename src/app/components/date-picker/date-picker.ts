import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Moment } from 'moment';

@Component({
  selector: 'app-date-picker',
  templateUrl: 'date-picker.html',
  styleUrls: ['date-picker.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DatePickerComponent
    }
  ]
})

export class DatePickerComponent implements OnInit, ControlValueAccessor {
  constructor() { }

  private onChange = (value: any) => { };

  public value: Moment;

  public writeValue(obj: any) {
    this.value = obj;
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) { }
  setDisabledState?(isDisabled: boolean) { }

  public ngOnInit() { }

  @Input()
  public max: Moment;

  @Input()
  public min: Moment;

  @Output()
  public change = new EventEmitter<any>();

  public innerChangeEvent() {
    this.onChange(this.value);
    this.change.emit(this.value);
  }
}
