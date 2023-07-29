/* eslint-disable camelcase */
import { ISchedulerInputGoal } from "@src/Interfaces/ISchedulerInputGoal";
import { calDays, getDiffInDates } from "@src/utils";
import { convertDateToDay, goalSplitter } from "@src/utils/SchedulerUtils";

import { addGoalDueHrs, getBufferValue, initImplSlotsOfGoalId, pushTaskToFlexibleArr, pushTaskToMyDays, setWeekEndOfGoal, updateBufferOfGoal } from ".";

interface ISlot {
  goalid: string;
  title: string;
  start: number;
  deadline: number;
}

const processBudgetGoal = (
  goal: ISchedulerInputGoal,
  slot: ISlot,
  validDays: string[],
  inputDuration: number,
  minDuration: number,
  iGoalStart: Date,
  startDayItr: number
) => {
  let goalStart = new Date(iGoalStart);
  let totalDuration = inputDuration - (goal.hoursSpent || 0);
  // console.log("🚀 ~ file: TaskGenerator.ts:17 ~ totalDuration:", goal.title, totalDuration, goal.hoursSpent);
  const min = minDuration;
  const startedOn = convertDateToDay(iGoalStart);
  const deadline = goal.deadline ? new Date(goal.deadline) : null;

  for (let i = startDayItr; i < 7; i += 1) {
    if (deadline && deadline < goalStart) {
      break;
    }
    const dayItr = convertDateToDay(goalStart);
    if (validDays.includes(dayItr)) {
      if (goal.title === "project A") { console.log(dayItr, startedOn); }
      if (dayItr === startedOn && i !== 0) {
        if (totalDuration >= 0) {
          addGoalDueHrs(goal.id, totalDuration);
        }
        totalDuration = inputDuration;
        setWeekEndOfGoal(goal.id, dayItr);
      }
      const slotD = min > totalDuration ? totalDuration : min;
      pushTaskToMyDays(i + 1, {
        ...slot,
        duration: slotD,
      });
      if (min > totalDuration) {
        const currentBufferValue = getBufferValue(goal.id) || [];
        if (!currentBufferValue) {
          updateBufferOfGoal(goal.id, []);
        }

        updateBufferOfGoal(goal.id, [...currentBufferValue,
          { nextBuffer: i + 1, availableBuffer: min - totalDuration }
        ]);
      }
      if (totalDuration > 0) {
        totalDuration -= min > totalDuration ? totalDuration : min;
      }
    }
    goalStart = new Date(goalStart.setDate(goalStart.getDate() + 1));
  }
};

const goalProcessor = (goal: ISchedulerInputGoal, weekStart: Date) => {
  initImplSlotsOfGoalId(goal.id);
  // const goalStartDate = goal.start ? new Date(goal.start) : new Date();
  const totalDuration = goal.min_duration;
  const { after_time = 0, before_time = 24, on_days = calDays, not_on = [] } = goal.filters || {};
  const slot = {
    goalid: goal.id,
    title: goal.title,
    start: after_time,
    deadline: before_time,
  };
  // if(goal.title === "sleep") { console.log(goal)}
  // if (goal.title === "Report") { console.log("🚀 ~ file: TaskGenerator.ts:78 ~ goalProcessor ~ validDays:", validDays); }
  let goalStart = new Date(goal.start || goal.createdAt);
  let validDays = [...on_days];

  if (goalStart.getDate() === weekStart.getDate() && after_time <= new Date().getHours()) {
    slot.start = new Date().getHours() + 1;
    if (slot.start === 24) {
      goalStart = new Date(goalStart.setDate(goalStart.getDate() + 1))
      slot.start = after_time;
    }
  }

  const startingDay = goalStart > weekStart ? getDiffInDates(goalStart, weekStart) : 0;
  if (goalStart > weekStart) {
    const startDayIndex = on_days.indexOf(convertDateToDay(goalStart));
    const today = on_days.indexOf(convertDateToDay(weekStart));
    validDays = [
      ...on_days.slice(...(
        today > startDayIndex ? [startDayIndex, today] : [startDayIndex])),
      ...(today <= startDayIndex ? on_days.slice(0, today) : [])
    ];
  }

  validDays = validDays.filter((ele) => !not_on.includes(ele));
  if (goal.repeat || goal.filters?.on_days) {
    if (goal.repeat === "daily") {
      for (let key = startingDay; key < 7; key += 1) {
        pushTaskToMyDays(key + 1, {
          ...slot,
          start: key > startingDay ? after_time : slot.start,
          duration: totalDuration,
        });
        slot.start = after_time;
      }
    } else if (!goal.budgets) {
      pushTaskToFlexibleArr(
        validDays,
        {
          ...slot,
          duration: totalDuration - (goal.hoursSpent || 0),
        }
      );
      // console.log("🚀 ~ file: MiniScheduler.ts:73 ~ schProcessor ~ weeklyGoals:", weeklyGoals);
    } else {
      processBudgetGoal(goal, slot, validDays, totalDuration, goal.budgets[0].min, goalStart, startingDay);
    }
  } else {
    processBudgetGoal(goal, slot, validDays, totalDuration, totalDuration, goalStart, startingDay);
  }
};

export const taskGenerator = (goals: { [id: string]: ISchedulerInputGoal }, weekStart: Date, weekEnd: Date) => {
  for (let index = 0; index < Object.keys(goals).length; index += 1) {
    const id = Object.keys(goals)[index];
    const goal = goals[id];
    if (new Date(goal.start || goal.createdAt) < weekEnd) {
      const splittedGoals: ISchedulerInputGoal[] = goalSplitter(goal);
      splittedGoals.forEach((sGoal: ISchedulerInputGoal) => {
        goalProcessor(sGoal, weekStart);
      });
    }
  }
};
