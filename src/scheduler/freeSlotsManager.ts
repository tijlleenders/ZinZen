import { getHrFromDateString, replaceHrInDateString } from "@src/utils/SchedulerUtils";
import { IFinalOutputSlot } from "@src/Interfaces/IScheduler";

export const fillUpFreeSlots = (scheduleOfTheDay: IFinalOutputSlot[]) => {
  let finalSchedule: IFinalOutputSlot[] = [];
  let prev = 0;
  let next = 0;
  for (let j = 0; j < scheduleOfTheDay.length; j += 1) {
    next = getHrFromDateString(scheduleOfTheDay[j].start);
    if (next !== prev) {
      const freeStart = `${scheduleOfTheDay[j].start}`;
      finalSchedule = [
        ...finalSchedule,
        {
          goalid: "free",
          title: "free",
          duration: next - prev,
          deadline: replaceHrInDateString(freeStart, next),
          start: replaceHrInDateString(freeStart, prev),
        },
      ];
    }
    finalSchedule.push({
      ...scheduleOfTheDay[j],
    });
    prev = getHrFromDateString(scheduleOfTheDay[j].deadline);
  }
  if (finalSchedule.length > 0) {
    const last = finalSchedule.slice(-1)[0];
    const deadline = getHrFromDateString(last.deadline);
    if (deadline !== 24) {
      finalSchedule.push({
        duration: 24 - deadline,
        goalid: "free",
        start: last.deadline,
        deadline: replaceHrInDateString(last.deadline, 0),
        title: "free",
      });
    } else {
      finalSchedule[finalSchedule.length - 1] = {
        ...last,
        deadline: replaceHrInDateString(last.deadline, 0),
      };
    }
  }
  return finalSchedule;
};
