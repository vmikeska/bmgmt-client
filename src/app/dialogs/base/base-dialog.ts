import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-base-dialog',
  templateUrl: 'base-dialog.html',
  encapsulation: ViewEncapsulation.None
})

export class BaseDialogComponent implements OnInit, AfterViewInit {
  constructor(
    public dlgSvc: DialogService,
    public dialogSvc: DialogService,
    // private cdr: ChangeDetectorRef
  ) {
  }

  public ngAfterViewInit() {
  //   this.cdr.markForCheck();
  }

  faTimes = faTimes;

  public ngOnInit() { }

  @Input()
  public title = '';

  public closeClicked() {
    this.dlgSvc.closeClicked.next();
    this.dialogSvc.destroy();
  }
}
