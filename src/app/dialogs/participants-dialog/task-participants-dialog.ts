import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TopicParticipantEnum } from 'src/app/api/participant/particip-ints';
import { TagItem } from 'src/app/components/role-tagger/role-tagger';
import { ProjectParticipantEntity } from 'src/app/data/entities/entities';
import { ProjectParticipantEntityOperations } from 'src/app/data/entity-operations';

@Component({
  selector: 'app-task-participants-dialog',
  templateUrl: 'participants-dialog.html',
  styleUrls: ['participants-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TaskParticipantDialogComponent implements OnInit {

  constructor(
    private projParEntSvc: ProjectParticipantEntityOperations
  ) { }

  public ngOnInit() { }

  @Input()
  public topicId: string;

  public TopicParticipantEnum = TopicParticipantEnum;

  public removeCallback = (item: TagItem) => {
    let e = this.projParEntSvc.deleteById(item.bindingId);
    return !!e;
  };

  public addCallback = (userId: string, role: TopicParticipantEnum) => {
    let e: ProjectParticipantEntity = {
      role: role,
      topic_id: this.topicId,
      user_id: userId
    };

    this.projParEntSvc.create(e);
    return e.id;
  };

  public loadCallback = (topicId: string) => {
    let e = this.projParEntSvc.ulist.filter(i => i.topic_id === topicId);
    return e;
  }

}

