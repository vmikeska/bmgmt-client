import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { PageIdEnum } from "../pages/page-id";

@Injectable({ providedIn: 'root' })
export class RedirectService {
  constructor(private router: Router) {

  }

  public toTask(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }

  public toProject(id: string) {
    let url = `${PageIdEnum.ProjectDetail}/id/${id}`;
    this.router.navigate([url]);
  }
}
