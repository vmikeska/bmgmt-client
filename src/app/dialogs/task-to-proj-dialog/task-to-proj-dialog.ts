import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectApiService } from 'src/app/api/project/project-api.service';
import { ProjectTaskBindingRequest } from 'src/app/api/project/project-ints';

@Component({
  selector: 'app-task-to-proj-dialog',
  templateUrl: 'task-to-proj-dialog.html',
  styleUrls: ['task-to-proj-dialog.scss']

})

export class TaskToProjDialogComponent implements OnInit {
  constructor(
    private projApiSvc: ProjectApiService
  ) { }

  public ngOnInit() {
    this.loadListAsync();
  }

  @Input()
  public taskId: string;

  @Input()
  public hasProject: boolean;

  public selected = new Subject();

  public items: ProjItemVM[] = [];

  public async loadListAsync() {
    let res = await this.projApiSvc.getList();
    this.items = res.map((i) => {
      let item: ProjItemVM = {
        id: i.id,
        name: i.name
      };

      return item;
    });
  }

  public projectClick(id: string) {
    this.assignTaskToProjAsync(id);
  }

  public removeClick() {
    this.unassignTaskToProjAsync();
  }

  public async unassignTaskToProjAsync() {
    let res = await this.projApiSvc.unassignTask(this.taskId);
    this.selected.next();
  }

  public async assignTaskToProjAsync(id: string) {
    let req: ProjectTaskBindingRequest = {
      taskId: this.taskId,
      projId: id
    };

    let res = await this.projApiSvc.assignTask(req);

    this.selected.next();
  }

}

export class ProjItemVM {
  public id: string;
  public name: string;

}
