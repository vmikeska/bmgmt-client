export interface ChatMessageResponse {
  id: string;
  fullName: string;
  date: string;
  text: string;
}

export interface NewChatMessageRequest {
  text: string;
  topicId: string;
}

export interface DeleteChatMessageRequest {
  id: string;
  topicId: string;
}
