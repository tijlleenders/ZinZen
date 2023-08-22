/* eslint-disable camelcase */
import { ISchedulerInputGoal } from "@src/Interfaces/IScheduler";
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
  currSlot: ISlot,
  validDays: string[],
  inputDuration: number,
  minDuration: number,
  iGoalStart: Date,
  startDayItr: number
) => {
  let goalStart = iGoalStart < new Date() ? new Date() : new Date(iGoalStart);
  const { after_time = 0 } = goal.filters || {};
  const slot = { ...currSlot };
  let totalDuration = inputDuration - (goal.hoursSpent || 0);
  const min = minDuration;
  const startedOn = convertDateToDay(iGoalStart);
  const deadline = goal.deadline ? new Date(goal.deadline) : null;
  for (let i = startDayItr; i < 7; i += 1) {
    if (deadline && deadline < goalStart) {
      break;
    }
    const dayItr = convertDateToDay(goalStart);
    if (validDays.includes(dayItr)) {
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
    if (goalStart.toDateString() === new Date().toDateString()) {
      slot.start = after_time;
    }
    goalStart = new Date(goalStart.setDate(goalStart.getDate() + 1));
  }
};

const goalProcessor = (goal: ISchedulerInputGoal, weekStart: Date, pushToNext: boolean) => {
  initImplSlotsOfGoalId(goal.id);
  const totalDuration = goal.min_duration || 0;
  const { after_time = 0, before_time = 24, on_days = calDays } = goal.filters || {};
  const slot = {
    goalid: goal.id,
    title: goal.title,
    start: after_time,
    deadline: before_time,
  };
  const createdAt = new Date(goal.createdAt);
  let goalStart = new Date(goal.start || goal.createdAt);

  if (!pushToNext && createdAt.toDateString() === weekStart.toDateString() && goalStart.toDateString() === createdAt.toDateString()) {
    if (after_time <= createdAt.getHours()) {
      slot.start = createdAt.getHours() + 1;
      if (slot.start === 24) {
        goalStart = new Date(goalStart.setDate(goalStart.getDate() + 1));
      }
    }
  }
  let validDays = [...on_days];
  const startingDay = (goalStart > weekStart ? getDiffInDates(goalStart, weekStart) : 0) + (pushToNext ? 1 : 0);
  if (goalStart > weekStart && !pushToNext) {
    const startDayIndex = on_days.indexOf(convertDateToDay(goalStart));
    const today = on_days.indexOf(convertDateToDay(weekStart));
    validDays = [
      ...on_days.slice(...(
        today > startDayIndex ? [startDayIndex, today] : [startDayIndex])),
      ...(today <= startDayIndex ? on_days.slice(0, today) : [])
    ];
  }

  // validDays = validDays.filter((ele) => !not_on.includes(ele));
  if (goal.repeat || goal.filters?.on_days) {
    if (goal.repeat === "daily") {
      const skipToday = totalDuration - (goal.hoursSpent || 0) === 0;
      for (let key = startingDay; key < 7; key += 1) {
        pushTaskToMyDays(key + 1, {
          ...slot,
          duration: totalDuration - (skipToday ? 0 : goal.hoursSpent || 0),
        });
        slot.start = after_time;
      }
    } else if (!goal.budgets) {
      const newSlot = {
        ...slot,
        start: after_time,
        duration: totalDuration - (goal.hoursSpent || 0),
      };
      pushTaskToFlexibleArr(
        validDays,
        newSlot
      );
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
      goalProcessor(splittedGoals[0], weekStart, false);
      if (splittedGoals.length === 2) {
        goalProcessor(splittedGoals[1], weekStart, true);
      }
    }
  }
};
