/* eslint-disable no-continue */
import { ISchedulerOutputSlot } from "@src/Interfaces/IScheduler";
import { formatDate, getHrFromDateString, replaceHrInDateString } from "@src/utils/SchedulerUtils";
import {
  getBlockingSlotsOfTheDayForGoalId,
  getDueHrs,
  getUsedBlockers,
  initBlockers,
  pushToImpossible,
  updateBlockers,
} from ".";

export const createImpossibleSlot = (
  task: ISchedulerOutputSlot,
  tmpStartDate: Date,
  selectedDay: number,
  start: number,
  end: number,
) => {
  const predictedDeadline = start + task.duration;
  const actualDeadline =
    task.deadline < predictedDeadline && task.deadline < end
      ? task.deadline
      : predictedDeadline > end
      ? end > task.deadline
        ? task.deadline
        : end
      : predictedDeadline;

  return {
    ...task,
    start: formatDate(tmpStartDate.getDate() + selectedDay - 1, start),
    deadline: formatDate(tmpStartDate.getDate() + selectedDay - 1, actualDeadline),
    duration: actualDeadline - start,
  };
};

export const fillUpImpSlotsForGoalId = (goalId: string, startDay: number, lastDay: number) => {
  let dueHrs = getDueHrs(goalId);
  // console.log("🚀 ~ file: ImpSlotManager.ts:23 ~ fillUpImpSlotsForGoalId ~ dueHrs:", dueHrs);
  if (dueHrs) {
    for (let dayItr = startDay; dayItr < lastDay && dueHrs !== 0; dayItr += 1) {
      const pickSlots = getBlockingSlotsOfTheDayForGoalId(goalId, dayItr);
      if (pickSlots.length > 0) {
        for (let psIndex = 0; psIndex < pickSlots.length && dueHrs !== 0; psIndex += 1) {
          const thisSlot = pickSlots[psIndex];
          const currentBlockers = getUsedBlockers(thisSlot.goalid);
          if (currentBlockers) {
            if (currentBlockers[dayItr]?.includes(psIndex)) {
              continue;
            }
            updateBlockers(thisSlot.goalid, dayItr, [...(currentBlockers[dayItr] || []), psIndex]);
          } else {
            initBlockers(thisSlot.goalid, dayItr, psIndex);
          }
          if (thisSlot.duration > dueHrs) {
            pushToImpossible(dayItr, {
              ...thisSlot,
              duration: dueHrs,
              deadline: replaceHrInDateString(
                thisSlot.deadline,
                getHrFromDateString(thisSlot.start) + (thisSlot.duration - dueHrs),
              ),
            });
            dueHrs = 0;
          } else {
            pushToImpossible(dayItr, { ...thisSlot });
            dueHrs -= thisSlot.duration;
          }
        }
      }
    }
  }
};
