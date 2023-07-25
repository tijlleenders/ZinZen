/* eslint-disable no-continue */
/* eslint-disable no-var */
import { IFinalOutputSlot, ISchedulerOutput, ISchedulerOutputSlot, TBufferValue } from "@src/Interfaces/ISchedulerInputGoal";
import { formatDate, getHrFromDateString, replaceHrInDateString } from "@src/utils/SchedulerUtils";

var flexibleWeeklyGoals: {
    slot: ISchedulerOutputSlot;
    validDays: string[];
}[] = [];
var dueTaskHrs: { [goalId: string]: number } = {};
var buffer: { [goalId: string]: TBufferValue} = {};
var myDays: ISchedulerOutputSlot[][] = [[], [], [], [], [], [], [], []];
var { scheduled, impossible }: ISchedulerOutput = { scheduled: [], impossible: [] };

const blockingSlots: { [goalId: string]: IFinalOutputSlot[][] } = {};
const usedBlockers: { [id: string]: { [day: number]: number[] } } = {};

export const initImplSlotsOfGoalId = (goalId: string) => {
  blockingSlots[goalId] = [[], [], [], [], [], [], [], []];
};

export const pushTaskToMyDays = (selectedDay: number, slot: ISchedulerOutputSlot) => {
  myDays[selectedDay] = [...myDays[selectedDay], { ...slot }];
};

export const pushTaskToFlexibleArr = (validDays: string[], slot: ISchedulerOutputSlot) => {
  flexibleWeeklyGoals.push({
    slot: { ...slot },
    validDays: { ...validDays }
  });
};

export const addGoalDueHrs = (goalId: string, hrs: number) => {
  dueTaskHrs[goalId] = hrs + (dueTaskHrs[goalId] || 0);
};

export const updateDueHrs = (goalId: string, hrs: number) => {
  dueTaskHrs[goalId] = hrs;
};

export const updateBufferOfGoal = (goalId: string, value: TBufferValue) => {
  buffer[goalId] = [...value];
};

export const updateBufferOfTheDay = (goalId: string, day: number, value) => {
  buffer[goalId][day] = { ...value };
};

export const getBufferValue = (goalId: string) => buffer[goalId];

export const getBlockingSlotsOfTheDayForGoalId = (goalId: string, day: number) => blockingSlots[goalId][day];

export const getAllDueTasks = () => ({ ...dueTaskHrs });
export const getDueHrs = (goalId: string) => (dueTaskHrs[goalId]);

export const getUsedBlockers = (goalId: string) => (usedBlockers[goalId]);

export const initBlockers = (goalId: string, dayItr: number, value: number) => {
  usedBlockers[goalId] = { [dayItr]: [value] };
};
export const updateBlockers = (goalId : string, day: number, value: number[]) => {
  usedBlockers[goalId][day] = [...value];
};

export const pushToImpossible = (day: number, slot: IFinalOutputSlot) => {
  impossible[day].outputs.push(slot);
};

export const createImpossibleSlot = (task: ISchedulerOutputSlot, tmpStartDate: Date, selectedDay: number, start: number, end: number) => {
  const predictedDeadline = start + task.duration;
  const actualDeadline = task.deadline < predictedDeadline && task.deadline < end ?
    task.deadline : predictedDeadline > end ?
      end > task.deadline ? task.deadline : end
      : predictedDeadline;

  return {
    ...task,
    start: formatDate(tmpStartDate.getDate() + selectedDay - 1, start),
    deadline: formatDate(tmpStartDate.getDate() + selectedDay - 1, actualDeadline),
    duration: actualDeadline - start,
  };
};

export const generateAndPushImpSlot = (task: ISchedulerOutputSlot, tmpStartDate: Date, selectedDay: number, start: number, end: number) => {
  const impSlot = createImpossibleSlot(task, tmpStartDate, selectedDay, start, end);
  blockingSlots[task.goalid][selectedDay].push(impSlot);
};

export const fillUpImpSlotsForGoalId = (goalId: string, lastDay: number) => {
  let dueHrs = getDueHrs(goalId);
  if (dueHrs) {
    for (let dayItr = 1; dayItr < lastDay && dueHrs !== 0; dayItr += 1) {
      const pickSlots = getBlockingSlotsOfTheDayForGoalId(goalId, dayItr);
      if (pickSlots.length > 0) {
        for (let psIndex = 0; psIndex < pickSlots.length && dueHrs !== 0; psIndex += 1) {
          const thisSlot = pickSlots[psIndex];
          const currentBlockers = getUsedBlockers(thisSlot.goalid);
          if (currentBlockers) {
            if (currentBlockers[dayItr]?.includes(psIndex)) {
              // if (thisSlot.goalid === "6debddbd-6558-4a1f-9884-1b3467b887cb") { console.log("exists", thisSlot); }
              continue;
            }
            updateBlockers(thisSlot.goalid, dayItr, [...(currentBlockers[dayItr] || []), psIndex]);
          } else {
            initBlockers(thisSlot.goalid, dayItr, psIndex);
          }
          // if (thisSlot.goalid === "53a8e2e5-b659-4f1f-8b44-b394158dc49d") { console.log("🚀 ~ file: MiniScheduler.ts:262 ~ thisSlot:", thisSlot, dueHrs, getHrFromDateString(thisSlot.start), (thisSlot.duration - dueHrs)); }
          if (thisSlot.duration > dueHrs) {
            pushToImpossible(dayItr, {
              ...thisSlot,
              duration: dueHrs,
              deadline: replaceHrInDateString(thisSlot.deadline,
                getHrFromDateString(thisSlot.start) + (thisSlot.duration - dueHrs))
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

export const initScheduled = (day: number) => {
  scheduled[day] = { day: `${day}`, outputs: [] };
};

export const initImpossible = (day: number) => {
  impossible[day] = { day: `${day}`, outputs: [] };
};

export const pushToScheduled = (selectedDay: number, task: IFinalOutputSlot) => {
  scheduled[selectedDay].outputs.push({ ...task });
};

export const getFlexibleWeeklyGoals = () => [...flexibleWeeklyGoals];

export const getTasksOfDay = (day: number) => [...myDays[day]];

export const getScheduledObj = () => scheduled;

export const getImpossibleObj = () => impossible;

export const resetAll = () => {
  dueTaskHrs = {};
  myDays = [[], [], [], [], [], [], [], []];
  buffer = {};
  scheduled = [];
  impossible = [];
  flexibleWeeklyGoals = [];
}