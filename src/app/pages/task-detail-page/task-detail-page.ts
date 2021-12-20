import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ChatMessageResponse, DeleteChatMessageRequest, NewChatMessageRequest } from 'src/app/api/chat/chat-ints';
import { TaskChatApiService } from 'src/app/api/chat/task-chat-api.service';
import { TaskTypeEnum, TaskResponse } from 'src/app/api/task/task-ints';
import { TaskDetailService } from 'src/app/services/task-detail.service';
import { DateUtils } from 'src/app/utils/date-utils';
import { WorkloadUtilsService } from 'src/app/utils/workload-utils.service';
import { UrlParamUtils } from 'src/lib/utils/url-utils';
import { PageIdEnum } from '../page-id';
import { faPen, faUserFriends, faImage, faFile, faBuilding, faComments } from '@fortawesome/free-solid-svg-icons';
import { AddActionVM } from 'src/app/components/add-actions/add-actions';
import { DialogService } from 'src/app/dialogs/base/dialog.service';
import { TaskBaseEditDialogComponent } from 'src/app/dialogs/task-base-edit-dialog/task-base-edit-dialog';

@Component({
  selector: 'app-task-detail-page',
  templateUrl: 'task-detail-page.html',
  styleUrls: ['task-detail-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TaskDetailPageComponent implements OnInit {
  constructor(
    private router: Router,
    private workloadUtilsSvc: WorkloadUtilsService,
    private taskDetailSvc: TaskDetailService,
    private taskChatApiSvc: TaskChatApiService,
    private dlgSvc: DialogService
  ) { }

  public ngOnInit() {
    this.initAsync();
  }

  public activeId = PageIdEnum.Dashboard;

  private async initAsync() {
    await this.loadTaskAsync();
    await this.reloadChatMessages();
    this.reloadAddActions();

    // show dialog at beginning
    // this.editClick();
  }

  faPen = faPen;

  public name = '';
  public dateAndLoad = '';
  public desc = '';

  public messages = new BehaviorSubject<ChatMessageResponse[]>([]);

  public addActions: AddActionVM[];

  public get detailVM() {
    return this.taskDetailSvc.vm;
  }

  public get hasMessages() {
    return !!this.messages.value.length;
  }

  public showChat = false;

  public get id() {
    let id = UrlParamUtils.getUrlParam<string>('id');
    return id;
  }

  private reloadAddActions() {
    this.addActions = [
      {
        ico: faUserFriends,
        txt: () => { return this.detailVM.participantsEditTxt; },
        callback: () => {
          this.taskDetailSvc.showEditParticipantsDialog();
        }
      },
      {
        ico: faBuilding,
        txt: () => { return this.detailVM.projectEditTxt; },
        callback: () => {
          this.taskDetailSvc.showEditProjectDialog();
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

  public editClick() {
    let dlg = this.dlgSvc.create(TaskBaseEditDialogComponent, (m) => {
      m.taskId = this.id;
      m.onSavedEvent.subscribe(() => {
        this.loadTaskAsync();
      });
    });
  }

  private getTaskTypeDesc(t: TaskResponse) {
    if (t.type === TaskTypeEnum.Month) {
      let str = `${DateUtils.getMonthName(t.month)}, ${t.year}`;
      return str;
    }

    if (t.type === TaskTypeEnum.Week) {
      let date = moment().year(t.year).week(t.week).day('monday');
      let str = `${t.week}. Week, ${DateUtils.getMonthName(date.month())}, ${t.year}`;
      return str;
    }

    if (t.type === TaskTypeEnum.ExactFlexible) {
      let str = `Working days between ${DateUtils.strFromStrDate(t.dateFrom)} and ${DateUtils.strFromStrDate(t.dateTo)}`;
      return str;
    }

    if (t.type === TaskTypeEnum.ExactStatic) {
      let str = `All days between ${DateUtils.strFromStrDate(t.dateFrom)} and ${DateUtils.strFromStrDate(t.dateTo)}`;
      return str;
    }

    return '';
  }

  public msgPostCallback = async (text: string) => {
    let req: NewChatMessageRequest = {
      text,
      topicId: this.id
    };
    await this.taskChatApiSvc.addMessage(req);

    await this.reloadChatMessages();
    this.reloadAddActions();
  }

  public msgDeleteCallback = async (id: string) => {
    let req: DeleteChatMessageRequest = {
      id,
      topicId: this.id
    };
    await this.taskChatApiSvc.deleteMessage(req);

    await this.reloadChatMessages();
  }

  private async loadTaskAsync() {
    if (!this.id) {
      return;
    }

    await this.taskDetailSvc.reloadAsync(this.id);

    let r = this.taskDetailSvc.res;

    this.name = r.task.name;
    this.desc = r.task.desc;
    let dateDesc = this.getTaskTypeDesc(r.task);
    let loadDesc = this.workloadUtilsSvc.daysHoursStr(r.task.manDays, r.task.manHours);

    this.dateAndLoad = [dateDesc, loadDesc].filter(i => !!i).join(', ');
  }

  private async reloadChatMessages() {
    let messages = await this.taskChatApiSvc.getMessages(this.id);
    this.messages.next(messages);

    this.showChat = !!messages.length;
  }
}




