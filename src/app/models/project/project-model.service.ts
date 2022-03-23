import { Injectable } from '@angular/core';
import { ProjectEntity } from 'src/app/data/entities/entities';
import { ProjectEntityOperations } from 'src/app/data/entity-operations';
import { NewId } from 'src/app/data/new-id';
import { UserService } from '../../services/user.service';
import { ProjectDO } from './project-model-ints';

@Injectable({ providedIn: 'root' })
export class ProjectModelService {
  constructor(
    private userSvc: UserService,
    private projEntSvc: ProjectEntityOperations
  ) { }

  public create(d: ProjectDO) {
    let e: ProjectEntity =
    {
      id: NewId.get(),
      owner_id: this.userSvc.id,
      name: d.name,
      desc: d.desc
    };

    this.projEntSvc.create(e);
    return e;
  }

}
