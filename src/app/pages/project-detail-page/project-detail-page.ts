import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ChatMessageResponse, DeleteChatMessageRequest, NewChatMessageRequest } from 'src/app/api/chat/chat-ints';
import { ProjectChatApiService } from 'src/app/api/chat/project-chat-api.service';
import { ProjectApiService } from 'src/app/api/project/project-api.service';
import { UrlParamUtils } from 'src/lib/utils/url-utils';
import { faComments, faEdit, faFile, faImage, faPen, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { PageIdEnum } from '../page-id';
import { Router } from '@angular/router'
import { TaskMapService } from 'src/app/components/assigned-tasks-list/tasksMap.service';
import { TaskResponse } from 'src/app/api/task/task-ints';
import { DatedBlockTasksVM } from 'src/app/components/comps-ints';
import { AddActionVM } from 'src/app/components/add-actions/add-actions';
import { ProjectDetailService } from 'src/app/services/project-detail.service';

@Component({
  selector: 'app-project-detail-page',
  templateUrl: 'project-detail-page.html',
  styleUrls: ['project-detail-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectDetailPageComponent implements OnInit {
  constructor(
    private projApiSvc: ProjectApiService,
    private projChatApiSvc: ProjectChatApiService,
    private router: Router,
    private taskMapSvc: TaskMapService,
    private projDetailSvc: ProjectDetailService
  ) { }

  faEdit = faEdit;
  faPen = faPen;

  public ngOnInit() {
    this.initAsync();
  }

  public activeId = PageIdEnum.Projects;

  private async initAsync() {
    await this.loadProjectAsync();
    await this.reloadChatMessages();
    await this.loadAssignedTasks();
    await this.loadUnassignedTasks();
    this.reloadAddActions();
  }

  public get detailVM() {
    return this.projDetailSvc.vm;
  }

  public messages = new BehaviorSubject<ChatMessageResponse[]>([]);
  public assignedTasks: DatedBlockTasksVM;
  public unassignedTasks: TaskResponse[] = [];

  public addActions: AddActionVM[];

  public get id() {
    let id = UrlParamUtils.getUrlParam<string>('id');
    return id;
  }

  public get showUnassignedTasks() {
    return !!this.unassignedTasks && !!this.unassignedTasks.length;
  }

  public get showAssignedTasks() {
    let at = this.assignedTasks;
    return at && (at.dates.length || at.months.length || at.weeks.length);
  }

  public title = '';
  public desc = '';

  public get hasMessages() {
    return !!this.messages.value.length;
  }

  public showChat = false;

  public editClick() {
    this.redirectToProjectEdit(this.id);
  }

  private async loadProjectAsync() {
    if (!this.id) {
      return;
    }

    await this.projDetailSvc.reloadAsync(this.id);

    let r = this.projDetailSvc.res;

    this.title = r.project.name;
    this.desc = r.project.desc;
  }

  private async loadAssignedTasks() {
    let tasks = await this.projApiSvc.getProjectAssignedTasks(this.id);
    this.assignedTasks = {
      dates: tasks.dates.map(i => this.taskMapSvc.mapTaskVM(i)),
      months: tasks.months.map(i => this.taskMapSvc.mapTaskVM(i)),
      weeks: tasks.weeks.map(i => this.taskMapSvc.mapTaskVM(i))
    }
  }

  private async loadUnassignedTasks() {
    let tasks = await this.projApiSvc.getProjectUnassignedTasks(this.id);
    this.unassignedTasks = tasks;
  }

  public taskLinkClick(id: string) {
    this.redirectToTaskDetail(id);
  }

  private redirectToTaskDetail(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }

  private redirectToProjectEdit(id: string) {
    let url = `${PageIdEnum.ProjectEdit}/id/${id}`;
    this.router.navigate([url]);
  }

  public msgPostCallback = async (text: string) => {
    let req: NewChatMessageRequest = {
      text,
      topicId: this.id
    };
    await this.projChatApiSvc.addMessage(req);

    await this.reloadChatMessages();
  }

  public msgDeleteCallback = async (id: string) => {
    let req: DeleteChatMessageRequest = {
      id,
      topicId: this.id
    };
    await this.projChatApiSvc.deleteMessage(req);

    await this.reloadChatMessages();
  }

  private reloadAddActions() {
    this.addActions = [
      {
        ico: faUserFriends,
        txt: () => { return this.detailVM.participantsEditTxt; },
        callback: () => {
          this.projDetailSvc.showEditParticipantsDialog();
        }
      },
      {
        ico: faImage,
        txt: () => { return 'No photos yet'; },
        callback: () => {
          alert('not implemented');
        }
      },
      {
        ico: faFile,
        txt: () => { return 'No documents yet photo'; },
        callback: () => {
          alert('not implemented');
        }
      },

    ];

    if (!this.hasMessages) {
      this.addActions.push({
        ico: faComments,
        txt: () => { return 'No comments yet, add first comment' },
        callback: () => {
          this.showChat = true;
        }
      });
    }
  }

  private async reloadChatMessages() {
    let messages = await this.projChatApiSvc.getMessages(this.id);
    this.messages.next(messages);

    this.showChat = !!messages.length;
  }
}



