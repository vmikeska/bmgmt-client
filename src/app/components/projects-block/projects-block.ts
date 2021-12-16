import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ProjItemVM } from 'src/app/dialogs/task-to-proj-dialog/task-to-proj-dialog';
import { PageIdEnum } from 'src/app/pages/page-id';

@Component({
  selector: 'app-projects-block',
  templateUrl: 'projects-block.html',
  styleUrls: ['projects-block.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectsBlockComponent implements OnInit {
  constructor(
    private router: Router
  ) { }

  ngOnInit() { }

  @Input()
  public title: string;

  @Input()
  public items: ProjItemVM[] = [];

  public projLinkClick(item: ProjItemVM) {
    this.redirectToProjectDetail(item.id);
  }

  private redirectToProjectDetail(id: string) {
    let url = `${PageIdEnum.ProjectDetail}/id/${id}`;
    this.router.navigate([url]);
  }
}
