import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { DatedBlockTasksVM } from '../comps-ints';

@Component({
  selector: 'app-assigned-tasks-block',
  templateUrl: 'assigned-tasks-block.html',
  styleUrls: ['assigned-tasks-block.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AssignedTasksBlockComponent implements OnInit {
  constructor() { }

  @Input()
  public tasks: DatedBlockTasksVM;

  ngOnInit() { }
}
