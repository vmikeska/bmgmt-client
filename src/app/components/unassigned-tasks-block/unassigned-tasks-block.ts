import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { TaskResponse } from 'src/app/api/task/task-ints';
import { PageIdEnum } from 'src/app/pages/page-id';

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
  public tasks: TaskResponse[];

  ngOnInit() { }

  public taskLinkClick(item: TaskResponse) {
    this.redirectToTaskDetail(item.id);
  }

  private redirectToTaskDetail(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }
}
