export interface TagResponse {
  id: string;
  name: string;
}

export interface TagBindingResponse {
  tagId: string;
  bindingId: string;
  name: string;
}

export interface NewTagBindingResponse {
  tagId: string;
  entityId: string;
}

export interface SearchTagResponse {
  str: string;
  entityId: string;
}
