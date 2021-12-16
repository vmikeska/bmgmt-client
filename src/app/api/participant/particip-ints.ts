
export interface TopicParticipantResponse {
  bindingId: string;
  role: number;
  userId: string;
  firstName: string;
  lastName: string;
}

export interface TopicNewParticipantRequest {
  topicId: string;
  userId: string;
  role: TopicParticipantEnum;
}

export enum TopicParticipantEnum { Admin, Worker, Observer }
