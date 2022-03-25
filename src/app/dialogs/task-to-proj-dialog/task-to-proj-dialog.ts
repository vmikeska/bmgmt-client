import { Component, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { ProjectTaskBindingRequest } from 'src/app/api/project/project-ints';
import { ProjectsTaskEntity } from 'src/app/data/entities/entities';
import { ProjectEntityOperations, ProjectsTaskEntityOperations } from 'src/app/data/entity-operations';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-task-to-proj-dialog',
  templateUrl: 'task-to-proj-dialog.html',
  styleUrls: ['task-to-proj-dialog.scss']
})

export class TaskToProjDialogComponent implements OnInit {
  constructor(
    // private projApiSvc: ProjectApiService
    private projTaskEntSvc: ProjectsTaskEntityOperations,
    private projEntSvc: ProjectEntityOperations,
    private userSvc: UserService
  ) { }

  public ngOnInit() {
    this.loadList();
  }

  @Input()
  public taskId: string;

  @Input()
  public hasProject: boolean;

  public selected = new Subject();

  public items: ProjItemVM[] = [];

  public loadList() {
    //todo: add other types of projects, like admin and so on
    let es = this.projEntSvc.getByFilter(i => i.owner_id === this.userSvc.id);
    this.items = es.map((i) => {
      let item: ProjItemVM = {
        id: i.id,
        name: i.name
      };

      return item;
    });
  }

  public projectClick(id: string) {
    this.assignTaskToProj(id);
  }

  public removeClick() {
    this.unassignTaskToProj();
  }

  public unassignTaskToProj() {
    this.projTaskEntSvc.deleteByFind(i => i.task_id === this.taskId);
    this.selected.next();
  }

  public assignTaskToProj(id: string) {
    let e: ProjectsTaskEntity = {
      task_id: this.taskId,
      proj_id: id
    };

    this.projTaskEntSvc.create(e);

    this.selected.next();
  }

}

export class ProjItemVM {
  public id: string;
  public name: string;

}
