import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { faPen, faSave } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-or-edit-line',
  templateUrl: 'add-or-edit-line.html',
  styleUrls: [ 'add-or-edit-line.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AddOrEditLineComponent implements OnInit {
  constructor() { }


  ngOnInit() { }

  @Input()
  public saveCallback: () => Promise<boolean>;

  @Input()
  public editable = true;

  public get ico() {
    return this.editing ? faSave : faPen;
  }

  public editing = false;

  public btnClick() {
    if (!this.editing) {
      this.editing = true;
      return;
    }

    this.executeSaveAsync();
  }

  private async executeSaveAsync() {
    let successful = await this.saveCallback();
    if (!successful) {
      //todo: dialog
      alert(`save didn't work`);
      return;
    }

    this.editing = false;
  }
}
