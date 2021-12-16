import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { LocationApiService } from 'src/app/api/location/location-api.service';
import { LocationSearchResponse } from 'src/app/api/location/location-ints';
import { LocationSaveResponse } from 'src/app/api/user/user-ints';
@Component({
  selector: 'app-address-autocomplete',
  templateUrl: 'address-autocomplete.html',
  styleUrls: ['address-autocomplete.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: AddressAutocompleteComponent
    }
  ],
  encapsulation: ViewEncapsulation.None
})
export class AddressAutocompleteComponent implements ControlValueAccessor, OnInit {

  public options = new BehaviorSubject<LocationSearchResponse[]>([]);

  public searchStr = '';

  public coords: number[];

  public showOptions = false;

  onChange = (value: LocationSaveResponse) => { };

  constructor(
    private locationApiSvc: LocationApiService
  ) {

  }

  writeValue(loc: LocationSaveResponse) {
    if (loc) {
      this.searchStr = loc.text;
      this.coords = loc.coords;
    }
  }

  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  registerOnTouched(fn: any) { }

  setDisabledState?(isDisabled: boolean) { }

  public searchChange() {

    let tempRes: LocationSaveResponse = {
      text: this.searchStr,
      coords: []
    };

    this.onChange(tempRes)
    this.searchAsync(this.searchStr);
    this.showOptions = true;
  }

  public itemClick(option: LocationSearchResponse) {
    this.coords = option.coordinates;

    let i: LocationSaveResponse = {
      coords: this.coords,
      text: option.text2
    };
    this.onChange(i);
    this.searchStr = option.text2;
    this.showOptions = false;
  }

  public ngOnInit() {

  }

  private async searchAsync(str: string) {
    let res = await this.locationApiSvc.search(str);
    this.options.next(res);
  }

}


