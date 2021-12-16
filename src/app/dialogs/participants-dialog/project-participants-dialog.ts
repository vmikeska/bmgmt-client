import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { TopicNewParticipantRequest, TopicParticipantEnum } from 'src/app/api/participant/particip-ints';
import { ProjectParticipantApiService } from 'src/app/api/participant/project-participant-api.service';
import { TagItem } from 'src/app/components/role-tagger/role-tagger';


@Component({
  selector: 'app-project-participants-dialog',
  templateUrl: 'participants-dialog.html',
  styleUrls: ['participants-dialog.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProjectParticipantDialogComponent implements OnInit {
  constructor(
    private projParticApiSvc: ProjectParticipantApiService
  ) { }

  public ngOnInit() { }

  @Input()
  public topicId: string;

  public TopicParticipantEnum = TopicParticipantEnum;

  public removeCallback = async (item: TagItem) => {
    let deleted = await this.projParticApiSvc.remove(item.bindingId);
    return deleted;
  };

  public addCallback = async (userId: string, role: TopicParticipantEnum) => {
    let req: TopicNewParticipantRequest = {
      role: role,
      topicId: this.topicId,
      userId
    };
    let bindingId = await this.projParticApiSvc.add(req);
    return bindingId;
  };

  public loadCallback = async (topicId: string) => {
    let res = await this.projParticApiSvc.getList(topicId);
    return res;
  }

}
