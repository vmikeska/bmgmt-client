import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TopicNewParticipantRequest, TopicParticipantEnum } from 'src/app/api/participant/particip-ints';
import { TaskParticipantApiService } from 'src/app/api/participant/task-participant-api.service';
import { TagItem } from 'src/app/components/role-tagger/role-tagger';


@Component({
  selector: 'app-task-participants-dialog',
  templateUrl: 'participants-dialog.html',
  styleUrls: ['participants-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})

export class TaskParticipantDialogComponent implements OnInit {
  constructor(
    private taskParticApiSvc: TaskParticipantApiService
  ) { }

  public ngOnInit() { }

  @Input()
  public topicId: string;

  public TopicParticipantEnum = TopicParticipantEnum;

  public removeCallback = async (item: TagItem) => {
    let deleted = await this.taskParticApiSvc.remove(item.bindingId);
    return deleted;
  };

  public addCallback = async (userId: string, role: TopicParticipantEnum) => {
    let req: TopicNewParticipantRequest = {
      role: role,
      topicId: this.topicId,
      userId
    };
    let bindingId = await this.taskParticApiSvc.add(req);
    return bindingId;
  };

  public loadCallback = async (topicId: string) => {
    let res = await this.taskParticApiSvc.getList(topicId);
    return res;
  }

}
