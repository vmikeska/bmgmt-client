import { ParticipantsOverviewReponse } from "../task/task-ints";

export interface ProjectDetailResponse
{
    project: ProjectResponse;
    participants: ParticipantsOverviewReponse[];
}

export interface ProjectResponse {
  id: string;
  name: string;
  desc: string;
}

export interface ProjectTaskBindingRequest {
  projId: string;
  taskId: string;
}

