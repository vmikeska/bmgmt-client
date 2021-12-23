import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-dialog-action-button',
  templateUrl: 'dialog-action-button.html',
  styleUrls: ['dialog-action-button.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DialogActionButtonComponent implements OnInit {
  constructor() { }

  ngOnInit() { }

  @Output()
  public click = new EventEmitter();

  public clickHandler() {
    this.click.emit();
  }

  @Input()
  public icon: IconDefinition;
}
