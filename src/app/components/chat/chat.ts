import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { ChatMessageResponse } from 'src/app/api/chat/chat-ints';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-chat',
  templateUrl: 'chat.html',
  styleUrls: ['chat.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ChatComponent implements OnInit {
  constructor() { }

  public ngOnInit() {
    this.messages.subscribe(() => {
      this.mapVM();
    });
  }

  faEnvelope = faEnvelope;
  faUser = faUser;

  public vms: ChatMessageVM[];

  public text = '';

  @Input()
  public messages: BehaviorSubject<ChatMessageResponse[]>;

  @Input()
  public postCallback: (txt: string) => void;

  @Input()
  public deleteCalback: (id: string) => void;


  public get showMessages() {
    return !!this.messages.value.length;
  }

  public async postClick() {
    await this.postCallback(this.text);
    this.text = '';
  }

  public deleteClick(id: string) {
    this.deleteCalback(id);
  }

  private mapVM() {
    let msgs = this.messages.value;
    this.vms = msgs.map((m) => {

      let md = moment.utc(m.date);
      let date = md.format('HH:MM DD.MM.YYYY');

      let vm: ChatMessageVM = {
        id: m.id,
        fullName: m.fullName,
        text: m.text,
        date
      };

      return vm;
    });
  }

}


export interface ChatMessageVM {
  id: string;
  fullName: string;
  date: string;
  text: string;
}

