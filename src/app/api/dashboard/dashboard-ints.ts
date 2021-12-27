import { TaskTypeEnum } from "../task/task-ints";

export interface DashTaskResponse {
  id: string;
  name: string;
  type: TaskTypeEnum;
  isOwner: boolean;
}

export interface DashProjResponse {
  id: string;
  name: string;
  isOwner: boolean;
}

export interface DashResultResponse {
  tasks: DashTaskResponse[];
  projs: DashProjResponse[];
}

export interface DashResultRequest {
  onlyUnfinished: boolean;
  search: string;
}
