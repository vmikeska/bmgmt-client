import { CreationTypeEnum } from "../ints/enums";

export interface CreationTypeItem {
  label: string;
  value: CreationTypeEnum;
}


export interface TaskItemVM {
  id: string;
  name: string;
  date: string;
  load: string;
}

export interface DatedBlockTasksVM {
  dates: TaskItemVM[];
  months: TaskItemVM[];
  weeks: TaskItemVM[];
}


export interface ProjItemVM {
  id: string;
  name: string;
}


