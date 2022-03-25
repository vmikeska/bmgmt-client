import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { PageIdEnum } from 'src/app/pages/page-id';
import { TaskItemVM } from '../comps-ints';

@Component({
  selector: 'app-unassigned-tasks-block',
  templateUrl: 'unassigned-tasks-block.html',
  styleUrls: ['unassigned-tasks-block.scss'],
  encapsulation: ViewEncapsulation.None
})

export class UnassignedTasksBlockComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  @Input()
  public tasks: TaskItemVM[];

  ngOnInit() { }

  public taskLinkClick(item: TaskItemVM) {
    this.redirectToTaskDetail(item. id);
  }

  private redirectToTaskDetail(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }
}
