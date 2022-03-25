import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UrlParamUtils } from 'src/lib/utils/url-utils';
import { faComments, faEdit, faFile, faImage, faMapMarkerAlt, faPen, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { PageIdEnum } from '../page-id';
import { Router } from '@angular/router'
import { TaskMapService } from 'src/app/components/assigned-tasks-list/tasksMap.service';
import { TaskTypeEnum } from 'src/app/api/task/task-ints';
import { DatedBlockTasksVM, TaskItemVM } from 'src/app/components/comps-ints';
import { AddActionVM } from 'src/app/components/add-actions/add-actions';
import { ProjectDetailService } from 'src/app/services/project-detail.service';
import { LocationSaveResponse } from 'src/app/api/user/user-ints';
import { FormControl } from '@angular/forms';
import { ProjectChatMessagesEntityOperations, ProjectEntityOperations, ProjectsTaskEntityOperations,
  TaskEntityOperations } from 'src/app/data/entity-operations';
import { ProjectChatMessagesEntity, TaskChatMessagesEntity } from 'src/app/data/entities/entities';
import * as moment from 'moment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-project-detail-page',
  templateUrl: 'project-detail-page.html',
  styleUrls: ['project-detail-page.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectDetailPageComponent implements OnInit {
  constructor(
    private projChatEntSvc: ProjectChatMessagesEntityOperations,
    private taskEnvSvc: TaskEntityOperations,
    private projEntSvc: ProjectEntityOperations,
    private projTaskBindingEntSvc: ProjectsTaskEntityOperations,
    private router: Router,
    private taskMapSvc: TaskMapService,
    private projDetailSvc: ProjectDetailService,
    private userSvc: UserService
  ) { }

  faEdit = faEdit;
  faPen = faPen;
  faMapMarkerAlt = faMapMarkerAlt;

  public ngOnInit() {
    this.init();
  }

  public addressFormControl = new FormControl();

  public location: string;
  public title = '';
  public desc = '';
  public name = '';

  private init() {
    this.loadProject();
    this.reloadChatMessages();
    this.loadTasks();
    this.reloadAddActions();
  }

  public get detailVM() {
    return this.projDetailSvc.vm;
  }

  public messages = new BehaviorSubject<TaskChatMessagesEntity[]>([]);
  public assignedTasks: DatedBlockTasksVM;
  public unassignedTasks: TaskItemVM[] = [];

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

  public get hasMessages() {
    return !!this.messages.value.length;
  }

  public showChat = false;

  public nameSaveCallback = () => {
    let task = this.projEntSvc.getById(this.id);
    task.name = this.name;
    this.projEntSvc.updateById(task);
    this.title = task.name;
  };

  public locationSaveCallback = () => {
    let fcv = <LocationSaveResponse>this.addressFormControl.value;
    let task = this.projEntSvc.getById(this.id);
    task.location = {
      text: fcv.text,
      coords: fcv.coords
    };
    this.projEntSvc.updateById(task);
    this.location = task.location.text;
  };

  public descSaveCallback = () => {
    let task = this.projEntSvc.getById(this.id);
    task.desc = this.desc;
    this.projEntSvc.updateById(task);
    this.desc = task.desc;
  };

  private loadProject() {
    if (!this.id) {
      return;
    }

    this.projDetailSvc.reload(this.id);

    let vm = this.projDetailSvc.vm;


    this.title = vm.e.name;
    this.desc = vm.e.desc;
    this.name = vm.e.name;
    this.location = vm.e.location ? vm.e.location.text : '';
  }

  private loadTasks() {

    let bindings = this.projTaskBindingEntSvc.getByFilter(i => i.proj_id === this.id);

    this.assignedTasks = {
      dates: [],
      months: [],
      weeks: []
    };
    this.unassignedTasks = [];

    for (let binding of bindings) {
      let task = this.taskEnvSvc.getByFind(i => i.id === binding.task_id);

      let vm = this.taskMapSvc.mapTaskVM(task);

      if (task.type === TaskTypeEnum.Unassigned) {
        this.unassignedTasks.push(vm);
      }
      if (task.type === TaskTypeEnum.Month) {
        this.assignedTasks.months.push(vm);
      }
      if (task.type === TaskTypeEnum.Week) {
        this.assignedTasks.weeks.push(vm);
      }
      if ([TaskTypeEnum.ExactFlexible, TaskTypeEnum.ExactStatic].includes(task.type)) {
        this.assignedTasks.dates.push(vm);
      }
    }
  }

  public taskLinkClick(id: string) {
    this.redirectToTaskDetail(id);
  }

  private redirectToTaskDetail(id: string) {
    let url = `${PageIdEnum.TaskDetail}/id/${id}`;
    this.router.navigate([url]);
  }

  public msgPostCallback = (text: string) => {

    let e: ProjectChatMessagesEntity = {
      text,
      topic_id: this.id,
      author_id: this.userSvc.id,
      posted: moment.utc(),
      fullName: this.userSvc.fullName
    };
    this.projChatEntSvc.create(e);

    this.reloadChatMessages();
    this.reloadAddActions();
  }

  public msgDeleteCallback = (id: string) => {
    this.projChatEntSvc.deleteById(id);
    this.reloadChatMessages();
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

  private reloadChatMessages() {
    //todo: get fresh from server
    let messages = this.projChatEntSvc.list.filter(i => i.topic_id === this.id);
    this.messages.next(messages);

    this.showChat = !!messages.length;
  }


}



