import * as moment from 'moment';
import { Moment } from 'moment';
import { TaskTypeEnum, WorkloadResponse } from 'src/app/api/task/task-ints';
import { TaskEntity } from 'src/app/data/entities/entities';
import { Day, Week, EventPosition } from './work-load-data-loader.service';


export class AssignTaskEvents {

  constructor(
    private tasks: TaskEntity[],
    private days: Day[],
    private weeks: Week[]
  ) {
  }

  public assign() {
    this.tasks.forEach((task) => {
      let isDateRangeType = [TaskTypeEnum.ExactFlexible, TaskTypeEnum.ExactStatic].includes(task.type);
      if (isDateRangeType) {

        let dateFrom = moment.utc(task.dateFrom).startOf('d');
        let dateFromSafe = this.getDateFromSafe(dateFrom);
        let dateTo = moment.utc(task.dateTo).startOf('d');

        let firstDay = this.getDayByDate(dateFromSafe);
        let currentDate = firstDay.day.clone();

        let issueNewPosition = true;
        let posNo: number;

        while (currentDate.isSameOrBefore(dateTo)) {

          let day = this.getDayByDate(currentDate);
          issueNewPosition = issueNewPosition || (day.dayOfWeek === 1);

          if (issueNewPosition) {
            posNo = this.getPositionFromDayUntilEndOfWeek(currentDate);
            issueNewPosition = false;
          }

          let pos: EventPosition = {
            position: posNo,
            taskId: task.id
          };


          day.eventPositions.push(pos);

          currentDate.add(1, 'd');
        }

      }
    });

  }

  private getPositionFromDayUntilEndOfWeek(currentDate: Moment) {
    let pos = 1;
    while (true) {
      let week = this.getWeekFromDate(currentDate);
      let inWeekFromDate = currentDate.clone();
      let inWeekToDate = week.days[6].day;

      let available = this.isPositionAvailableInDaysRange(inWeekFromDate, inWeekToDate, pos);
      if (available) {
        return pos;
      }

      pos++;
    }
  }

  private getWeekFromDate(day: Moment) {
    let weekNo = day.isoWeek();
    let week = this.weeks.find(w => w.no === weekNo);
    return week;
  }

  private isPositionAvailableInDaysRange(from: Moment, to: Moment, pos: number) {
    let currentDate = from.clone();
    while (currentDate.isSameOrBefore(to)) {

      let day = this.getDayByDate(currentDate);

      let position = day.eventPositions.find(p => p.position === pos);

      let positionTaken = !!position;

      if (positionTaken) {
        return false;
      }

      currentDate.add(1, 'd');
    }

    return true;
  }

  private getDateFromSafe(dateFrom: Moment) {
    let daysDates = this.days.map(d => d.day);
    let firstProjectedDate = daysDates[0];

    let taskStartsBeforeProjection = dateFrom.isBefore(firstProjectedDate);
    if (taskStartsBeforeProjection) {
      return firstProjectedDate;
    }

    return dateFrom;
  }

  private getDayByDate(date: Moment) {
    let day = this.days.find(d => d.day.isSame(date));
    return day;
  }

}
