import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject } from 'rxjs';
import { ItemOption } from 'src/app/ints/common-ints';

@Component({
  selector: 'app-drop-down',
  templateUrl: 'drop-down.html',
  styleUrls: ['drop-down.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: DropDownComponent
    }
  ],
  encapsulation: ViewEncapsulation.None
})

export class DropDownComponent implements OnInit, ControlValueAccessor {
  constructor() { }

  onChange = (value: any) => { };

  public writeValue(obj: any) {
    this.value = obj;
    this.updateText();
  }

  public registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) { }
  setDisabledState?(isDisabled: boolean) { }

  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;

  public ngOnInit() {
    this.options.subscribe(() => {
      this.updateText();
    });
  }

  private updateText() {
    let activeOpt = this.options.value.find(o => o.value === this.value);
    if (activeOpt) {
      this.text = activeOpt.label;
    }
  }

  public get internalDisabled() {
    return this.disabled || this.dropdownOrAutocomplete;
  }

  public dropdownOrAutocomplete = true;

  public isOpened = false;

  @Output()
  public change = new EventEmitter<any>();

  @Input()
  public directionDown = true;

  @Input()
  public options = new BehaviorSubject<ItemOption[]>([]);

  @Input()
  public placeholder = '';

  @Input()
  public disabled = false;

  public value: any;
  public text: string;

  public searchChange() {

  }

  public inputClick() {
    this.isOpened = !this.isOpened;
  }

  public optionClick(o: ItemOption) {
    this.value = o.value;
    this.text = o.label;
    this.onChange(o.value);
    this.isOpened = false;
    this.change.emit(this.value);
  }
}
