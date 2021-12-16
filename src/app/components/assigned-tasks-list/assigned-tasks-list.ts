import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskResponse } from 'src/app/api/task/task-ints';
import { PageIdEnum } from 'src/app/pages/page-id';
import { TaskItemVM } from '../comps-ints';

@Component({
  selector: 'app-assigned-tasks-list',
  templateUrl: 'assigned-tasks-list.html',
  styleUrls: ['assigned-tasks-list.scss']
})

export class AssignedTasksListComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  @Input()
  public items: TaskItemVM[];

  public taskLinkClick(item: TaskResponse) {
    this.redirectToTaskDetail(item.id);
  }

  private redirectToTaskDetail(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }
}
