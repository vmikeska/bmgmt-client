import { BaseRouteReuseStrategy } from '@angular/router';
import { flatten, maxBy, minBy, pull } from 'lodash';
import { cloneDeep, orderBy } from 'lodash-es';
import { DayLoadResponse, TaskResponse, TaskTypeEnum } from 'src/app/api/task/task-ints';
import { Week, EventBlock, EventBar, Day } from './work-load-data-loader.service';


export class GenerateEventBlocks2 {

  constructor(
    private weeks: Week[],
    private tasks: TaskResponse[]
  ) {
  }

  private hasWeekLoads(week: Week) {
    for (let i = 0; i <= 6; i++) {
      let day = week.days[i];
      if (day.tempLoads.length) {
        return true;
      }
    }

    return false;
  }

  public assign() {


    this.weeks.forEach((week) => {

      week.days.forEach(day => {
        let loads = day.response.loads.filter(l => {
          return [TaskTypeEnum.ExactFlexible, TaskTypeEnum.ExactStatic].includes(l.type);
        });

        let orderedLoads = orderBy(loads, i => i.taskId);
        day.tempLoads = cloneDeep(orderedLoads);
      })

    });





    this.weeks.forEach((week) => {

      if (week.no === 50) {
        var aaaa = 'test';
      }

      let weekHasAnyLoads = this.hasWeekLoads(week);

      let bars: EventBar[] = [];
      let activeEventBar: EventBar;

      let pushBar = () => {
        let daysDiff = activeEventBar.endDay.day.diff(activeEventBar.startDay.day, 'd') + 1;
        activeEventBar.days = daysDiff;
        bars.push(cloneDeep(activeEventBar));
        activeEventBar = null;
      };

      while (weekHasAnyLoads) {

        for (let dayNo = 1; dayNo <= 7; dayNo++) {
          let day = week.days[dayNo - 1];

          //no loads this day
          let hasDayLoads = !!day.tempLoads.length;
          if (!hasDayLoads) {

            //finish opened bar
            if (activeEventBar) {
              pushBar();
              dayNo = 0;
            }

            continue;
          }


          if (activeEventBar) {
            let continuesLoad = day.tempLoads.find(i => i.taskId === activeEventBar.taskId);
            //finish opened bar if not following
            if (continuesLoad) {
              activeEventBar.endDay = day;
              pull(day.tempLoads, continuesLoad);
            } else {
              pushBar();
              dayNo = 0;
            }
          }
          //start new bar
          else {
            let nextLoad = day.tempLoads[0];
            let task = this.getTaskById(nextLoad.taskId);
            activeEventBar = {
              taskId: nextLoad.taskId,
              startDay: day,
              endDay: day,
              name: task.name
            };

            pull(day.tempLoads, nextLoad);
          }
        }

        if (activeEventBar) {
          pushBar();
        }

        weekHasAnyLoads = this.hasWeekLoads(week);
      }






      ////////

      for (let i = 1; i <= bars.length; i++) {
        let bar = bars[i - 1];
        bar.sd = bar.startDay.day.format('DD.MM.YYYY');
        bar.ed = bar.endDay.day.format('DD.MM.YYYY');
      }

      week.eventBlocks = [];

      var orderdBars = orderBy(bars, i => { i.startDay.day.toDate(); });
      for (let bar of orderdBars) {
        if (!week.eventBlocks.length) {
          week.eventBlocks.push({ position: 1, bars: [bar] });
          continue;
        }

        for (let eb of week.eventBlocks) {
          let fits = this.fitsBlock(bar, eb);
          if (fits) {
            eb.bars.push(bar);
            continue;
          }
        }

        let currentMaxLevelBlock = maxBy(week.eventBlocks, b => b.position);
        week.eventBlocks.push({ position: currentMaxLevelBlock.position + 1, bars: [bar] });
      }

      for (let eb of week.eventBlocks) {
        let firstBar = eb.bars[0];
        let firstDay = firstBar.startDay.day.isoWeekday();
        if (firstDay != 1) {
          let emptyBar: EventBar = { days: firstDay - 1 };
          eb.bars = [emptyBar].concat(eb.bars);
        }
      }

      // for (let i = 1; i <= bars.length; i++) {
      //   let bar = bars[i - 1];
      //   week.eventBlocks.push({ position: i, bars: [bar] });
      // }

    });

  }

  private fitsBlock(bar: EventBar, eb: EventBlock) {

    let firstStart = minBy(eb.bars, b => b.startDay.day.isoWeekday());
    let lastEnd = maxBy(eb.bars, b => b.endDay.day.isoWeekday());

    let fits = bar.startDay.day.isoWeekday() > lastEnd.endDay.day.isoWeekday();
    return fits;
  }




  // private addTaskBar(taskId: string, days: number) {
  //   let task = this.getTaskById(taskId);
  //   let name = task.name;
  //   let bar: EventBar = { days, taskId, name };
  //   this.currentEventBlock.bars.push(bar);
  // }

  // private addEmptyTaskBar() {
  //   let bar: EventBar = { days: 1, taskId: null, name: null };
  //   this.currentEventBlock.bars.push(bar);
  // }

  private getTaskById(id: string) {
    let t = this.tasks.find(i => i.id === id);
    return t;
  }

  // private getMaxWeekPos(week: Week) {
  //   let poss2d = week.days.map(i => i.eventPositions);
  //   let poss = flatten(poss2d);
  //   if (!poss.length) {
  //     return null;
  //   }
  //   let maxPosObj = maxBy(poss, i => i.position);
  //   return maxPosObj.position;
  // }
}
