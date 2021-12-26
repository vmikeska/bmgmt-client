import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactDetailPageComponent } from './pages/contact-detail-page/contact-detail-page';
import { ContactsPageComponent } from './pages/contacts-page/contacts-page';
import { CreateAccountComponent } from './pages/create-account-page/create-account-page';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page';
import { LogInPageComponent } from './pages/log-in-page/log-in-page';
import { PageIdEnum } from './pages/page-id';
import { ProjectDetailPageComponent } from './pages/project-detail-page/project-detail-page';
import { ProjectsPageComponent } from './pages/projects-page/projects-page';
import { TaskDetailPageComponent } from './pages/task-detail-page/task-detail-page';
import { WorkLoadComponent } from './pages/work-load-page/work-load-page';
import { UserDetailPageComponent } from './pages/user-detail-page/user-detail-page';

const routes: Routes = [
  {
    path: PageIdEnum.Workload,
    component: WorkLoadComponent
  },
  {
    path: PageIdEnum.Contacts,
    component: ContactsPageComponent
  },
  {
    path: `${PageIdEnum.TaskDetail}/id/:id`,
    component: TaskDetailPageComponent
  },
  {
    path: PageIdEnum.NewAccount,
    component: CreateAccountComponent
  },
  {
    path: PageIdEnum.Dashboard,
    component: DashboardPageComponent
  },
  {
    path: PageIdEnum.LogIn,
    component: LogInPageComponent
  },
  {
    path: PageIdEnum.Projects,
    component: ProjectsPageComponent
  },
  {
    path:  `${PageIdEnum.ProjectDetail}/id/:id`,
    component: ProjectDetailPageComponent
  },
  {
    path:  `${PageIdEnum.UserDetail}/id/:id`,
    component: UserDetailPageComponent
  },
  {
    path:  PageIdEnum.UserDetail,
    component: UserDetailPageComponent
  },
  {
    path:  `${PageIdEnum.ContactDetail}/id/:id`,
    component: ContactDetailPageComponent
  },
  {
    path: '**',
    redirectTo: PageIdEnum.LogIn
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
