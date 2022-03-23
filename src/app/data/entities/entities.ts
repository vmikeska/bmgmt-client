
import { Moment } from "moment";
import { TopicParticipantEnum } from "src/app/api/participant/particip-ints";
import { TaskTypeEnum } from "src/app/api/task/task-ints";
import { EntityBase, SearchableEntity } from "./base-enitity";

export interface LocationSE {
  text: string;
  coords: number[];
}

export interface TaskEntity extends SearchableEntity {

  dateFrom?: Moment;
  dateTo?: Moment;
  type?: TaskTypeEnum;

  week?: number;
  year?: number;
  month?: number;
  mid?: number;
  wid?: number;
  manHours?: number;
  manDays?: number;
  location?: LocationSE;

}



// public class AccountEntity : EntityBase
// {
//     public ObjectId user_id { get; set; }
//     public string password { get; set; }
//     public string mail { get; set; }
//     public DateTime created { get; set; }
//     //public bool EmailSent { get; set; }
//     //public bool EmailConfirmed { get; set; }
// }

export interface UserEntity extends EntityBase {
  firstName: string;

  lastName: string;

  desc: string;

  phone: string;

  mail: string;

  website: string;

  location: LocationSE

  fields: TagSE[];
}

export interface UserSettingsEntity extends EntityBase {
  user_id: string;
  dayWorkingHours: number;
  dayHoursTreshold: number;
}

export interface TagBindingBaseEntity extends EntityBase {
  entity_id: string;
  tag_id: string;
}

export interface TagBaseEntity extends EntityBase {
  name: string;
}

export interface UserSkillsBindingEntity extends TagBindingBaseEntity { }
export interface UserSkillsTagEntity extends TagBaseEntity { }

export interface ProjectEntity extends SearchableEntity {
  location?: LocationSE;
}

export interface TopicParticipantEntity extends EntityBase {
  topic_id: string;
  user_id: string;
  role: TopicParticipantEnum;
}

export interface TaskParticipantEntity extends TopicParticipantEntity { }

export interface ProjectParticipantEntity extends TopicParticipantEntity { }

export interface BaseChatMessagesEntity extends EntityBase {
  topic_id: string;
  posted: Moment;
  text: string;
  author_id: string;
  fullName: string;
}

export interface TaskChatMessagesEntity extends BaseChatMessagesEntity { }
export interface ProjectChatMessagesEntity extends BaseChatMessagesEntity { }

export interface ProjectsTaskEntity extends EntityBase {
  task_id: string;
  proj_id: string;
}

export interface NativeContactsEntity extends EntityBase {
  user_id: string;
  contacts: CoworkerBindingSE[];

  //public List<ObjectId> Friends { get; set; }

  //public List<ObjectId> Proposed { get; set; }

  //public List<ObjectId> AwaitingConfirmation { get; set; }

  //public List<ObjectId> Blocked { get; set; }

}

export interface CustomContactsEntity extends EntityBase {
  user_id: string;
  contacts: ContactSE[];
}

export interface CoworkerBindingSE {
  id: string;
  user_id: string;
  stared: boolean;

  // some custom stuff, possibly tags, etc

}

export interface ContactSE {
  id: string;
  stared: boolean;
  firstName: string;
  lastName: string;
}

export interface TagSE {
  id: string;
  cat_id: string;
  name: string;
}
