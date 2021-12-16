import { Component, ViewContainerRef } from '@angular/core';
import { DialogService } from './dialog.service';

@Component({
  selector: 'app-dialog-placeholder',
  template: ''
})

export class DialogPlaceholderComponent {
  constructor(
    viewContainer: ViewContainerRef,
    dlgSvc: DialogService,
  ) {
    dlgSvc.viewContainer = viewContainer;
  }
}
