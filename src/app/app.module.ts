import { HttpClientModule } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { CommonGlobal } from 'src/lib/base/common-global';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WorkLoadComponent } from './pages/work-load-page/work-load-page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { SelectComponent } from './components/select/select';
import { DatePickerComponent } from './components/date-picker/date-picker';
import { InputComponent } from './components/input/input';
import { RoleTaggerComponent } from './components/role-tagger/role-tagger';
import { DashboardPageComponent } from './pages/dashboard-page/dashboard-page';
import { ContactsPageComponent } from './pages/contacts-page/contacts-page';
import { TaskDetailPageComponent } from './pages/task-detail-page/task-detail-page';
import { CreateAccountComponent } from './pages/create-account-page/create-account-page';
import { LogInPageComponent } from './pages/log-in-page/log-in-page';
import { ProjectsPageComponent } from './pages/projects-page/projects-page';
import { ProjectEditPageComponent } from './pages/project-edit-page/project-edit-page';
import { ProjectDetailPageComponent } from './pages/project-detail-page/project-detail-page';
import { BaseDialogComponent } from './dialogs/base/base-dialog';
import { TaskToProjDialogComponent } from './dialogs/task-to-proj-dialog/task-to-proj-dialog';
import { DialogPlaceholderComponent } from './dialogs/base/dialog-placeholder';
import { ChatComponent } from './components/chat/chat';
import { HeaderContainerComponent } from './components/header-container/header-container';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AssignedTasksListComponent } from './components/assigned-tasks-list/assigned-tasks-list';
import { ContactDetailPageComponent } from './pages/contact-detail-page/contact-detail-page';
import { AssignedTasksBlockComponent } from './components/assigned-tasks-block/assigned-tasks-block';
import { UnassignedTasksBlockComponent } from './components/unassigned-tasks-block/unassigned-tasks-block';
import { ProjectsBlockComponent } from './components/projects-block/projects-block';
import { AddActionsComponent } from './components/add-actions/add-actions';
import { AddressAutocompleteComponent } from './components/address-autocomplete/address-autocomplete';
import { ProjectParticipantDialogComponent } from './dialogs/participants-dialog/project-participants-dialog';
import { TaskParticipantDialogComponent } from './dialogs/participants-dialog/task-participants-dialog';
import { PeopleFilterComponent } from './pages/work-load-page/people-filter/people-filter';
import { CalendarTaskDialogComponent } from './dialogs/calendar-task-dialog/calendar-task-dialog';
import { TaskBaseEditDialogComponent } from './dialogs/task-base-edit-dialog/task-base-edit-dialog';
import { UserDetailPageComponent } from './pages/user-detail-page/user-detail-page';
import { ListTaggerComponent } from './components/list-tagger/list-tagger';
import { AddOrEditLineComponent } from './components/add-or-edit-line/add-or-edit-line';
import { DropDownComponent } from './components/drop-down/drop-down';
import { CalendarDayDialogComponent } from './dialogs/calendar-day-dialog/calendar-day-dialog';
import { DialogActionButtonComponent } from './components/dialog-action-button/dialog-action-button';

export function initFactory() {
  return () => {
    CommonGlobal.environment = environment;
  };
}


@NgModule({
  declarations: [
    AppComponent,

    WorkLoadComponent,
    DashboardPageComponent,
    ContactsPageComponent,
    TaskDetailPageComponent,
    CreateAccountComponent,
    LogInPageComponent,
    ProjectsPageComponent,
    ProjectDetailPageComponent,
    ProjectEditPageComponent,
    ContactDetailPageComponent,
    UserDetailPageComponent,


    SelectComponent,
    DatePickerComponent,
    InputComponent,
    AddOrEditLineComponent,
    DropDownComponent,
    DialogActionButtonComponent,

    BaseDialogComponent,
    DialogPlaceholderComponent,
    TaskToProjDialogComponent,
    ProjectParticipantDialogComponent,
    TaskParticipantDialogComponent,
    CalendarTaskDialogComponent,
    TaskBaseEditDialogComponent,
    CalendarDayDialogComponent,

    RoleTaggerComponent,
    ListTaggerComponent,
    ChatComponent,
    HeaderContainerComponent,
    AssignedTasksListComponent,
    AssignedTasksBlockComponent,
    UnassignedTasksBlockComponent,
    ProjectsBlockComponent,
    AddActionsComponent,
    AddressAutocompleteComponent,
    PeopleFilterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    FontAwesomeModule

  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initFactory,
      deps: [],
      multi: true
    },

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
