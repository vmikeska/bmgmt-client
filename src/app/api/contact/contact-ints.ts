
export interface ContactResponse {
  id: string;
  name: string;
  alreadyAdded: boolean;
  tags: TagResponse[];
}
export interface BindingChangeRequest {
  contactId: string;
}

export interface TagResponse {
  name: string;
}
