import { TaskResponse } from "../api/task/task-ints";

export interface CreationTypeItem {
  label: string;
  value: CrationTypeEnum;
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

export enum CrationTypeEnum { SimpleTask, FullTask, Project }


