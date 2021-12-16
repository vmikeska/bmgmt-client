import * as moment from 'moment';
import { Moment } from 'moment';
import { TaskTypeEnum, WorkloadResponse } from 'src/app/api/task/task-ints';
import { Day, Week, EventPosition } from './work-load-data-loader.service';


export class AssignTaskEvents {

  constructor(
    private response: WorkloadResponse,
    private days: Day[],
    private weeks: Week[]
  ) {
  }

  public assign() {
    this.response.tasks.forEach((task) => {
      let isDateRangeType = [TaskTypeEnum.ExactFlexible, TaskTypeEnum.ExactStatic].includes(task.type);
      if (isDateRangeType) {
        let dateFrom = moment(task.dateFrom).startOf('d');
        let dateTo = moment(task.dateTo).startOf('d');

        let currentDate = dateFrom.clone();
        let firstDay = this.getDayByDate(currentDate);
        let availablePos = this.getAvailablePos(firstDay.eventPositions);

        let pos: EventPosition = {
          position: availablePos,
          taskId: task.id
        };

        while (currentDate.isSameOrBefore(dateTo)) {

          let day = this.getDayByDate(currentDate);
          day.eventPositions.push(pos);

          currentDate.add(1, 'd');
        }

      }
    });

  }

  private getDayByDate(date: Moment) {
    let day = this.days.find(d => d.day.isSame(date));
    return day;
  }

  private getAvailablePos(positions: EventPosition[]) {
    let pos = 1;
    while (true) {
      let posObj = positions.find((i) => i.position === pos);
      if (!posObj) {
        return pos;
      }

      pos++;
    }
  }
}
