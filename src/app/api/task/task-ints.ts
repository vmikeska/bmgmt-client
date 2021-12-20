import { TopicParticipantEnum } from "../participant/particip-ints";

export interface TaskDetailResponse {
  task: TaskResponse;
  projectBinding: TaskProjectResponse;
  participants: ParticipantsOverviewReponse[];
}

export interface ParticipantsOverviewReponse {
  type: TopicParticipantEnum;
  count: number;
}

export interface TaskProjectResponse {
  hasProject: boolean;
  projId: string;
  projName: string;
}

export interface WorkloadResponse {
  days: WorkloadDayResponse[];
  weeks: WorkloadWeekResponse[];
  months: WorkloadMonthResponse[];
  tasks: TaskResponse[];
  dateRange: RangeRequest;
}

export interface WorkloadWeekResponse {
  year: number;
  no: number;
  totalHours: number;
}

export interface WorkloadMonthResponse {
  year: number;
  no: number;
  totalHours: number;
  workingDays: number;
  involvedTasksIds: string[];
}

export interface WorkloadDayResponse {
  date: string;
  totalHours: number;
  busyIndex: number;
  loads: DayLoadResponse[];
}

export interface DayLoadResponse {
  taskId: string;
  hours: number;
  type: TaskTypeEnum;
}

export interface WorkloadRequest {
  useDays: number[];
  from: string;
  to: string;
}

export interface RangeRequest {
  from: string;
  to: string;
}

export enum TaskTypeEnum { Unassigned, ExactFlexible, ExactStatic, Week, Month }

export interface TaskResponse extends TaskDateTypeResponse {
  ownerId?: string;
  projId?: string;
  desc?: string;
}

export interface TaskDateTypeResponse {
  id?: string;
  name: string;
  type: TaskTypeEnum;
  dateFrom?: string;
  dateTo?: string;
  week?: number;
  year?: number;
  month?: number;
  manHours?: number;
  manDays?: number;
}

export interface TaskGroupsResponse {
  dates: TaskResponse[];
  months: TaskResponse[];
  weeks: TaskResponse[];
}
