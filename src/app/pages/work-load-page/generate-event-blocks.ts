import { maxBy, minBy, pull, cloneDeep, orderBy, sortBy } from 'lodash-es';
import { TaskResponse, TaskTypeEnum } from 'src/app/api/task/task-ints';
import { TaskEntity } from 'src/app/data/entities/entities';
import { Week, EventBlock, EventBar, Day, DayLoad } from './work-load-data-loader.service';


export class GenerateEventBlocks {

  constructor(
    private days: Day[],
    private weeks: Week[],
    private tasks: TaskEntity[]
  ) {
  }

  public assign() {

    this.weeks.forEach((week) => {
      this.assignTempLoadsForRangeTasks(week);
      let bars = this.createUnleveledEventBars(week);
      this.sortBarsIntoLevels(bars, week);
      this.fillGapsWithEmptyBlocks(week);
    });

  }

  private hasWeekLoads(week: Week) {
    for (let i = 0; i <= 6; i++) {
      let day = week.days[i];
      if (day.loads.length) {
        return true;
      }
    }

    return false;
  }

  private assignTempLoadsForRangeTasks(week: Week) {
    week.days.forEach(day => {
      let loads = day.loads.filter(l => {
        return [TaskTypeEnum.ExactFlexible, TaskTypeEnum.ExactStatic].includes(l.task.type);
      });

      let orderedLoads = orderBy(loads, i => i.task.id);
      day.loads = cloneDeep(orderedLoads);
    });
  }

  private sortBarsIntoLevels(bars: EventBar[], week: Week) {
    var orderdBars = orderBy(bars, i => { i.startDay.day.toDate(); });
    for (let bar of orderdBars) {
      if (!week.eventBlocks.length) {
        week.eventBlocks.push({ position: 1, bars: [bar] });
        continue;
      }

      let successfullyPushed = this.pushBlock(week.eventBlocks, bar);
      if (!successfullyPushed) {
        let currentMaxLevelBlock = maxBy(week.eventBlocks, b => b.position);
        week.eventBlocks.push({ position: currentMaxLevelBlock.position + 1, bars: [bar] });
      }
    }
  }

  private createUnleveledEventBars(week: Week) {
    let weekHasAnyLoads = this.hasWeekLoads(week);

    let bars: EventBar[] = [];
    let activeEventBar: EventBar;

    let dayNo = 1;

    let pushBar = () => {
      let daysDiff = activeEventBar.endDay.day.diff(activeEventBar.startDay.day, 'd') + 1;
      activeEventBar.days = daysDiff;
      bars.push(cloneDeep(activeEventBar));
      activeEventBar = null;
      dayNo = 1;
    };

    let iterations = 0;

    while (weekHasAnyLoads) {
      iterations++;

      let day = week.days[dayNo - 1];

      let pullLoad = (load: DayLoad) => {
        pull(day.loads, load);
        weekHasAnyLoads = this.hasWeekLoads(week);
      }

      //no loads this day
      let hasDayLoads = !!day.loads.length;
      if (!hasDayLoads) {

        //finish opened bar
        if (activeEventBar) {
          pushBar();
          continue;
        }

        dayNo++;
        continue;
      }

      if (activeEventBar) {
        let continuesLoad = day.loads.find(i => i.task.id === activeEventBar.taskId);
        //finish opened bar if not following
        if (continuesLoad) {
          activeEventBar.endDay = day;
          pullLoad(continuesLoad);
        } else {
          pushBar();
          continue;
        }
      }
      //start new bar
      else {
        let nextLoad = day.loads[0];
        let task = this.getTaskById(nextLoad.task.id);
        activeEventBar = {
          taskId: nextLoad.task.id,
          startDay: day,
          endDay: day,
          name: task.name
        };

        pullLoad(nextLoad);
      }

      dayNo++;

      let isAfterEndOfWeek = dayNo === 8;
      if (isAfterEndOfWeek || !weekHasAnyLoads) {
        pushBar();
      }
    }

    return bars;
  }

  private fillGapsWithEmptyBlocks(week: Week) {
    for (let block of week.eventBlocks) {
      let emptyBars: EventBar[] = [];

      let firstBar = block.bars[0];
      let firstDay = firstBar.startDay.day.isoWeekday();
      if (firstDay != 1) {
        let emptyBar: EventBar = { days: firstDay - 1, startDay: week.days[0] };
        emptyBars.push(emptyBar);
      }

      for (let barNo = 0; barNo <= block.bars.length - 1; barNo++) {
        let bar = block.bars[barNo];

        let hasNextBar = barNo + 1 <= block.bars.length - 1;
        if (!hasNextBar) {
          continue;
        }

        let nextBar = block.bars[barNo + 1];
        let barsDaysDiff = nextBar.startDay.day.diff(bar.endDay.day, 'd');
        if (barsDaysDiff > 1) {
          let startDate = bar.endDay.day.clone().add(1, 'd');
          let startDay = this.days.find(i => i.day.isSame(startDate));
          // let endDate = nextBar.startDay.day.clone().add(-1, 'd');
          emptyBars.push({ days: barsDaysDiff - 1, startDay })
        }
      }

      block.bars = sortBy(block.bars.concat(emptyBars), i => i.startDay.day.toDate());
    }
  }

  private pushBlock(ebs: EventBlock[], bar: EventBar) {
    for (let eb of ebs) {
      let fits = this.fitsBlock(bar, eb);
      if (fits) {
        eb.bars.push(bar);
        return true;
      }
    }

    return false;
  }

  private fitsBlock(bar: EventBar, eb: EventBlock) {

    let firstStart = minBy(eb.bars, b => b.startDay.day.isoWeekday());
    let lastEnd = maxBy(eb.bars, b => b.endDay.day.isoWeekday());

    let fits = bar.startDay.day.isoWeekday() > lastEnd.endDay.day.isoWeekday();
    return fits;
  }

  private getTaskById(id: string) {
    let t = this.tasks.find(i => i.id === id);
    return t;
  }

}
