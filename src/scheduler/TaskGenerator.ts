/* eslint-disable camelcase */
import { ISchedulerInputGoal } from "@src/Interfaces/ISchedulerInputGoal";
import { calDays } from "@src/utils";
import { convertDateToDay, goalSplitter } from "@src/utils/SchedulerUtils";

import { addGoalDueHrs, getBufferValue, initImplSlotsOfGoalId, pushTaskToFlexibleArr, pushTaskToMyDays, setWeekEndOfGoal, updateBufferOfGoal } from ".";

const processBudgetGoal = (
  goal: ISchedulerInputGoal,
  validDays: string[],
  inputDuration: number,
  minDuration: number,
  tmpStart: Date
) => {
  let tmp = new Date(tmpStart);
  let totalDuration = inputDuration - (goal.hoursSpent || 0);
  // console.log("🚀 ~ file: TaskGenerator.ts:17 ~ totalDuration:", goal.title, totalDuration, goal.hoursSpent);
  const min = minDuration;
  const createdAt = new Date(goal.createdAt);
  const createdOn = convertDateToDay(createdAt);
  const deadline = goal.deadline ? new Date(goal.deadline) : null;
  const { after_time = 0, before_time = 24 } = goal.filters || {};

  for (let i = 0; i < 7; i += 1) {
    if (deadline && deadline < tmp) {
      break;
    }
    const dayItr = convertDateToDay(tmp);
    if (validDays.includes(dayItr)) {
      if (goal.title === "project A") { console.log(dayItr, createdOn); }
      if (dayItr === createdOn && i !== 0) {
        if (totalDuration >= 0) {
          addGoalDueHrs(goal.id, totalDuration);
        }
        totalDuration = inputDuration;
        setWeekEndOfGoal(goal.id, dayItr);
      }
      const slot = {
        goalid: goal.id,
        title: goal.title,
      };
      const slotD = min > totalDuration ? totalDuration : min;
      pushTaskToMyDays(i + 1, {
        ...slot,
        start: after_time,
        deadline: before_time,
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
    tmp = new Date(tmp.setDate(tmp.getDate() + 1));
  }
};

const goalProcessor = (tmpStart: Date, goal: ISchedulerInputGoal) => {
  initImplSlotsOfGoalId(goal.id);
  // const goalStartDate = goal.start ? new Date(goal.start) : new Date();
  const totalDuration = goal.min_duration;
  const { after_time = 0, before_time = 24, on_days = calDays, not_on = [] } = goal.filters || {};
  const slot = {
    goalid: goal.id,
    title: goal.title,
  };
  // if(goal.title === "sleep") { console.log(goal)}
  const validDays = on_days.filter((ele) => !not_on.includes(ele));
  // if (goal.title === "Report") { console.log("🚀 ~ file: TaskGenerator.ts:78 ~ goalProcessor ~ validDays:", validDays); }
  if (goal.repeat || goal.filters?.on_days) {
    if (goal.repeat === "daily") {
      for (let key = 0; key < 7; key += 1) {
        pushTaskToMyDays(key + 1, {
          ...slot,
          start: after_time,
          deadline: before_time,
          duration: totalDuration,
        });
      }
    } else if (!goal.budgets) {
      pushTaskToFlexibleArr(
        validDays,
        {
          ...slot,
          start: after_time,
          deadline: before_time,
          duration: totalDuration - (goal.hoursSpent || 0),
        }
      );
      // console.log("🚀 ~ file: MiniScheduler.ts:73 ~ schProcessor ~ weeklyGoals:", weeklyGoals);
    } else {
      processBudgetGoal(goal, validDays, totalDuration, goal.budgets[0].min, tmpStart);
    }
  } else {
    processBudgetGoal(goal, validDays, totalDuration, totalDuration, tmpStart);
  }
};

export const taskGenerator = (goals: { [id: string]: ISchedulerInputGoal }, tmpStart: Date) => {
  for (let index = 0; index < Object.keys(goals).length; index += 1) {
    const id = Object.keys(goals)[index];
    const goal = goals[id];
    const splittedGoals: ISchedulerInputGoal[] = goalSplitter(goal);
    splittedGoals.forEach((sGoal: ISchedulerInputGoal) => {
      goalProcessor(tmpStart, sGoal);
    });
  }
};
