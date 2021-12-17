import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectApiService } from 'src/app/api/project/project-api.service';
import { PageIdEnum } from '../page-id';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { ProjItemVM } from 'src/app/components/comps-ints';
import { ProjectResponse } from 'src/app/api/project/project-ints';

@Component({
  selector: 'app-projects-page',
  templateUrl: 'projects-page.html',
  styleUrls: ['projects-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectsPageComponent implements OnInit {
  constructor(
    private projApiSvc: ProjectApiService,
    private router: Router
  ) { }

  public activeId = PageIdEnum.Projects;

  faPlus = faPlus;

  public ngOnInit() {
    this.loadOwnProjectsAsync();
  }

  public creationName = '';

  public ownProjects: ProjItemVM[] = [];

  private async createProjectAsync() {
    if (!this.creationName) {
      return;
    }

    let req: ProjectResponse = {
      id: null,
      name: this.creationName,
      desc: ''
    };

    var id = await this.projApiSvc.create(req);
    this.redirectToProjectDetail(id);
  }

  private redirectToProjectDetail(id: string) {
    let url = `${PageIdEnum.ProjectDetail}/id/${id}`;
    this.router.navigate([url]);
  }

  public createItemClick() {
    this.createProjectAsync();
  }

  private async loadOwnProjectsAsync() {
    let res = await this.projApiSvc.getList();

    this.ownProjects = res.map((i) => {
      let item: ProjItemVM = {
        id: i.id,
        name: i.name
      };
      return item;
    });

  }

}



