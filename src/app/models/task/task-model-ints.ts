import { Moment } from "moment";
import { TaskTypeEnum } from "src/app/api/task/task-ints";

export interface TaskDO {
  id?: string;
  name?: string;
  type?: TaskTypeEnum;
  manDays?: number;
  manHours?: number;
  desc?: string;
  month?: number;
  year?: number;
  week?: number;
  dateFrom?: Moment;
  dateTo?: Moment;
}
