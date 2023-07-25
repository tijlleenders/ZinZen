/* eslint-disable camelcase */
import { ISchedulerInputGoal } from "@src/Interfaces/ISchedulerInputGoal";
import { calDays } from "@src/utils";
import { convertDateToDay, goalSplitter } from "@src/utils/SchedulerUtils";

import { v4 as uuidv4 } from "uuid";
import { addGoalDueHrs, getBufferValue, initImplSlotsOfGoalId, pushTaskToFlexibleArr, pushTaskToMyDays, updateBufferOfGoal } from ".";

const processBudgetGoal = (
  goal: ISchedulerInputGoal,
  validDays: string[],
  inputDuration: number,
  minDuration: number,
  tmpStart: Date) => {
  let tmp = new Date(tmpStart);
  let totalDuration = inputDuration;
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
      const slot = {
        goalid: goal.id,
        taskid: uuidv4(),
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
    // if (dayItr === createdOn) {
    //   totalDuration = inputDuration;
    // }
    tmp = new Date(tmp.setDate(tmp.getDate() + 1));
  }
  if (totalDuration >= 0) {
    addGoalDueHrs(goal.id, totalDuration);
  }
};

