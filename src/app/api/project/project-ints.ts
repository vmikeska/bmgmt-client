import { ParticipantsOverviewReponse } from "../task/task-ints";
import { LocationSaveResponse } from "../user/user-ints";

export interface ProjectDetailResponse
{
    project: ProjectResponse;
    participants: ParticipantsOverviewReponse[];
}

export interface ProjectResponse {
  id: string;
  name: string;
  desc: string;
  location?: LocationSaveResponse;
}

export interface ProjectTaskBindingRequest {
  projId: string;
  taskId: string;
}

