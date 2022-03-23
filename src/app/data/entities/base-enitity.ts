export interface EntityBase {
  id?: string;
  deleted?: boolean;
  synced?: boolean;
}

export interface SearchableEntity extends EntityBase {
  name?: string;
  desc?: string;
  owner_id?: string;
  finished?: boolean;
}
