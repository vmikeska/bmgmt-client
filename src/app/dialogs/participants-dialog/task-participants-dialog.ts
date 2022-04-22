import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TopicParticipantEnum } from 'src/app/api/participant/particip-ints';
import { TagItem } from 'src/app/components/role-tagger/role-tagger';
import { ProjectParticipantEntity } from 'src/app/data/entities/entities';
import { ProjectParticipantEntityOperations, TaskParticipantEntityOperations } from 'src/app/data/entity-operations';

@Component({
  selector: 'app-task-participants-dialog',
  templateUrl: 'participants-dialog.html',
  styleUrls: ['participants-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TaskParticipantDialogComponent implements OnInit {

  constructor(
    private taskParEntSvc: TaskParticipantEntityOperations
  ) { }

  public ngOnInit() {
  }

  @Input()
  public topicId: string;

  public TopicParticipantEnum = TopicParticipantEnum;


  public removeCallback = (userId: string) => {
    this.taskParEntSvc.deleteByFind(i => i.entity_id === this.topicId && i.tag_id === userId);
    return true;
  };

  public addCallback = (userId: string, role: TopicParticipantEnum) => {
    let e: ProjectParticipantEntity = {
      role: role,
      entity_id: this.topicId,
      tag_id: userId
    };

    this.taskParEntSvc.create(e);
    return e.id;
  };

  public loadCallback = (topicId: string, role: TopicParticipantEnum) => {
    let e = this.taskParEntSvc.getByFilter(i => i.entity_id === topicId && i.role === role);
    return e;
  }

}

