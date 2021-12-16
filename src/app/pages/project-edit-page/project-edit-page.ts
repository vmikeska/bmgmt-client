import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { ProjectApiService } from 'src/app/api/project/project-api.service';
import { ProjectResponse } from 'src/app/api/project/project-ints';
import { UrlParamUtils } from 'src/lib/utils/url-utils';

@Component({
  selector: 'app-project-edit-page',
  templateUrl: 'project-edit-page.html',
  styleUrls: ['project-edit-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectEditPageComponent implements OnInit {
  constructor(
    private projApiSvc: ProjectApiService,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.initAsync();
  }

  public vm: ProjEditVM;

  faSave = faSave;

  public initialized = false;

  public get id() {
    let id = UrlParamUtils.getUrlParam<string>('id');
    return id;
  }

  public updateClick() {
    this.updateProjAsync();
  }

  private async initAsync() {
    let r = await this.projApiSvc.getById(this.id);

    this.vm = {
      id: r.id,
      name: r.name,
      desc: r.desc
    };

    this.initialized = true;
  }

  private async updateProjAsync() {
    let req: ProjectResponse = {
      id: this.vm.id,
      name: this.vm.name,
      desc: this.vm.desc,
    };

    await this.projApiSvc.update(req);

    this.snackBar.open('Project updated', 'close');
  }
}


export interface ProjEditVM {
  id: string;
  name: string;
  desc: string;
}
