import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TaskDetailService } from 'src/app/services/task-detail.service';
import { TaskUtils } from "src/app/services/task-utils";
import { WorkloadUtilsService } from 'src/app/utils/workload-utils.service';
import { UrlParamUtils } from 'src/lib/utils/url-utils';
import { PageIdEnum } from '../page-id';
import { faPen, faUserFriends, faImage, faFile, faBuilding, faComments, faMapMarkerAlt, faClock } from '@fortawesome/free-solid-svg-icons';
import { AddActionVM } from 'src/app/components/add-actions/add-actions';
import { DialogService } from 'src/app/dialogs/base/dialog.service';
import { TaskBaseEditDialogComponent, TaskEditTypeModeEnum } from 'src/app/dialogs/task-base-edit-dialog/task-base-edit-dialog';
import { LocationSaveResponse, UpdatePropRequest } from 'src/app/api/user/user-ints';
import { FormControl } from '@angular/forms';
import { TaskChatMessagesEntityOperations, TaskEntityOperations } from 'src/app/data/entity-operations';
import { BaseChatMessagesEntity, TaskChatMessagesEntity } from 'src/app/data/entities/entities';
import { UserService } from 'src/app/services/user.service';
import * as moment from 'moment';

@Component({
  selector: 'app-task-detail-page',
  templateUrl: 'task-detail-page.html',
  styleUrls: ['task-detail-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TaskDetailPageComponent implements OnInit {
  constructor(
    private router: Router,
    private taskEntSvc: TaskEntityOperations,
    private taskChatEntSvc: TaskChatMessagesEntityOperations,
    private workloadUtilsSvc: WorkloadUtilsService,
    private taskDetailSvc: TaskDetailService,
    private dlgSvc: DialogService,
    private userSvc: UserService
  ) { }

  public ngOnInit() {
    this.init();
  }

  public activeId = PageIdEnum.Dashboard;

  private init() {
    this.loadTask();
    this.reloadChatMessages();
    this.reloadAddActions();
  }

  faPen = faPen;
  faMapMarkerAlt = faMapMarkerAlt;
  faClock = faClock;

  public addressFormControl = new FormControl();

  public location: string;

  public name = '';
  public dateAndLoad = '';
  public desc = '';

  public messages = new BehaviorSubject<BaseChatMessagesEntity[]>([]);

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
      }
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
      m.id = this.id;
      m.title = 'Edit task base';
      m.mode = TaskEditTypeModeEnum.FullEdit;
      m.onSavedEvent.subscribe(() => {
        this.loadTask();
      });
    });
  }

  public nameSaveCallback = () => {
    let task = this.taskEntSvc.getById(this.id);
    task.name = this.name;
    this.taskEntSvc.updateById(task);
  };

  public locationSaveCallback = () => {
    let fcv = <LocationSaveResponse>this.addressFormControl.value;
    let task = this.taskEntSvc.getById(this.id);
    task.location = {
      text: fcv.text,
      coords: fcv.coords
    };
    this.taskEntSvc.updateById(task);
    this.location = task.location.text;
  };

  public descSaveCallback = async () => {
    let task = this.taskEntSvc.getById(this.id);
    task.desc = this.desc;
    this.taskEntSvc.updateById(task);
  };

  public msgPostCallback = (text: string) => {

    let e: TaskChatMessagesEntity = {
      text,
      topic_id: this.id,
      author_id: this.userSvc.id,
      posted: moment.utc(),
      fullName: this.userSvc.fullName
    };
    this.taskChatEntSvc.create(e);

    this.reloadChatMessages();
    this.reloadAddActions();
  }

  public msgDeleteCallback = (id: string) => {
    this.taskChatEntSvc.deleteById(id);
    this.reloadChatMessages();
  }

  private loadTask() {
    if (!this.id) {
      return;
    }

    this.taskDetailSvc.reload(this.id);

    let te = this.taskDetailSvc.te;

    this.name = te.name;
    this.desc = te.desc;

    if (te.location) {
      this.location = te.location.text;
    }

    let dateDesc = TaskUtils.getTaskTypeDesc(te);
    let loadDesc = this.workloadUtilsSvc.daysHoursStr(te.manDays, te.manHours);
    this.dateAndLoad = [dateDesc, loadDesc].filter(i => !!i).join(', ');
  }

  private async reloadChatMessages() {
    //todo: get fresh from server
    let messages = this.taskChatEntSvc.list.filter(i => i.topic_id === this.id);
    this.messages.next(messages);

    this.showChat = !!messages.length;
  }
}




