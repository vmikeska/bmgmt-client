import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { updateLocale } from 'moment';
import { TopicParticipantEnum } from 'src/app/api/participant/particip-ints';
import { TagItem } from 'src/app/components/role-tagger/role-tagger';
import { TaskParticipantEntity } from 'src/app/data/entities/entities';
import { TaskParticipantEntityOperations } from 'src/app/data/entity-operations';

@Component({
  selector: 'app-project-participants-dialog',
  templateUrl: 'participants-dialog.html',
  styleUrls: ['participants-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectParticipantDialogComponent implements OnInit {
  constructor(
    private taskParEntSvc: TaskParticipantEntityOperations
  ) { }

  public ngOnInit() { }

  @Input()
  public topicId: string;

  public TopicParticipantEnum = TopicParticipantEnum;

  public removeCallback = (userId: string) => {
    this.taskParEntSvc.deleteByFind(i => i.entity_id === this.topicId && i.tag_id === userId);
    return true;
  };

  public addCallback = (userId: string, role: TopicParticipantEnum): any => {
    // let e: TaskParticipantEntity = {
    //   role: role,
    //   topic_id: this.topicId,
    //   user_id: userId
    // };

    // this.taskParEntSvc.create(e);
    // return e.id;
    return null;
  };

  public loadCallback = (topicId: string, role: TopicParticipantEnum): any => {
    // let e = this.taskParEntSvc.ulist.filter(i => i.topic_id === topicId);
    // return e;
    return null;
  }

}
