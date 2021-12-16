import { flatten, maxBy } from 'lodash';
import { TaskResponse } from 'src/app/api/task/task-ints';
import { Week, EventBlock, EventBar } from './work-load-data-loader.service';


export class GenerateEventBlocks {

  constructor(
    private weeks: Week[],
    private tasks: TaskResponse[]
  ) {
  }
  private currentEventBlock: EventBlock;

  public assign() {
    this.weeks.forEach((week) => {

      let maxPosition = this.getMaxWeekPos(week);

      if (maxPosition) {
        for (let pos = 1; pos <= maxPosition; pos++) {

          this.currentEventBlock = { position: pos, bars: [] };
          week.eventBlocks.push(this.currentEventBlock);

          var openedTaskId = '';
          var daysCount = 1;

          for (let dayNo = 1; dayNo <= 7; dayNo++) {
            let currentDay = week.days[dayNo - 1];
            let aaaa = currentDay.day.format('DD.MM.YYYY');
            let currentPosDef = currentDay.eventPositions.find(p => p.position === pos);

            let streamOpened = !!openedTaskId;
            let isLastDayOfWeek = dayNo === 7;
            let isEmptyDef = !currentPosDef;

            if (streamOpened && isLastDayOfWeek) {
              this.addTaskBar(openedTaskId, daysCount + 1);
              continue;
            }

            if (isEmptyDef) {
              if (streamOpened) {
                this.addTaskBar(openedTaskId, daysCount);

                openedTaskId = null;
                daysCount = 1;
              }

              this.addEmptyTaskBar();
              continue;
            }

            if (streamOpened) {
              let currentTaskId = currentPosDef.taskId;

              let taskChanges = currentTaskId !== openedTaskId;
              if (taskChanges) {
                this.addTaskBar(openedTaskId, daysCount);

                openedTaskId = currentTaskId;
                daysCount = 1;
              } else {
                daysCount++;
              }

              continue;
            }

            openedTaskId = currentPosDef.taskId;
          }


        }


      }

    });
  }

  private addTaskBar(taskId: string, days: number) {
    let task = this.getTaskById(taskId);
    let name = task.name;
    let bar: EventBar = { days, taskId, name };
    this.currentEventBlock.bars.push(bar);
  }

  private addEmptyTaskBar() {
    let bar: EventBar = { days: 1, taskId: null, name: null };
    this.currentEventBlock.bars.push(bar);
  }

  private getTaskById(id: string) {
    let t = this.tasks.find(i => i.id === id);
    return t;
  }

  private getMaxWeekPos(week: Week) {
    let poss2d = week.days.map(i => i.eventPositions);
    let poss = flatten(poss2d);
    if (!poss.length) {
      return null;
    }
    let maxPosObj = maxBy(poss, i => i.position);
    return maxPosObj.position;
  }
}
