import { ISchedulerOutputSlot, ISchedulerInputGoal, IFinalOutputSlot } from "@src/Interfaces/ISchedulerInputGoal";

import { formatDate, breakTheTree, convertDateToDay } from "@src/utils/SchedulerUtils";
import { fillUpImpSlotsForGoalId } from "./ImpSlotManager";
import { taskGenerator } from "./TaskGenerator";
import { addGoalDueHrs, generateAndPushImpSlot, getAllDueTasks, getBufferValue, getDueHrs, getFlexibleWeeklyGoals, getImpossibleObj, getScheduledObj, getTasksOfDay, initImpossible, initScheduled, pushToScheduled, resetAll, updateBufferOfGoal, updateBufferOfTheDay, updateDueHrs } from ".";

const taskScheduler = (taskObj: ISchedulerOutputSlot, selectedDay: number, tmpStart: Date, currentHrs: number[]) => {
  const { start, deadline, duration, ...task } = taskObj;
  const defaultHrs = [...currentHrs];
  if (duration !== 0) {
    let startHrFound = true;
    let startHr = start;

    while (defaultHrs[startHr] !== -1) {
      if (startHr > 23) {
        startHrFound = false;
        break;
      }
      // if (taskObj.title.includes("project")) console.log(startHr, defaultHrs);
      generateAndPushImpSlot({ ...taskObj, duration }, tmpStart, selectedDay, startHr, defaultHrs[startHr]);
      startHr = defaultHrs[startHr];
    }
    if (startHrFound) {
      let tmpD = duration;
      let tmpS = startHr;
      let ptr = startHr;
      while (ptr <= deadline && tmpS !== deadline) {
        tmpD -= 1;
        ptr += 1;
        if (defaultHrs[ptr] !== -1 || tmpD === 0 || ptr === deadline) {
          const nextAvailable = ptr;
          defaultHrs.splice(tmpS, ptr - tmpS, ...[...Array(ptr - tmpS).keys()].map(() => nextAvailable));
          pushToScheduled(selectedDay, {
            ...task,
            start: formatDate(tmpStart.getDate() + selectedDay - 1, tmpS),
            deadline: formatDate(tmpStart.getDate() + selectedDay - 1, ptr),
            duration: ptr - tmpS,
          });
          while (defaultHrs[ptr] !== -1) {
            if (ptr > 23) {
              break;
            }
            // if (taskObj.title.includes("project")) console.log(ptr, defaultHrs[ptr], defaultHrs);
            generateAndPushImpSlot({ ...taskObj, duration: tmpD }, tmpStart, selectedDay, ptr, defaultHrs[ptr]);
            ptr = defaultHrs[ptr];
          }
          if (ptr > 23) {
            break;
          }
          tmpS = ptr;
          if (tmpD === 0) {
            break;
          }
        }
      }
      if (tmpD !== 0) {
        if (["project a", "work"].includes(task.title)) { console.log("Incomplete Duration", task.title, tmpD); }
        addGoalDueHrs(task.goalid, tmpD);
      }
      else if (["project a", "work"].includes(task.title)) { console.log("Duration completed"); }
    }
  }
  return defaultHrs;
};
const operator = (item: number, tmpStart: Date, defaultHrs: number[]) => {
  let currentHrs = [...defaultHrs];
  const selectedDay = item + 1;
  const arr = getTasksOfDay(selectedDay);
  arr.sort((a, b) => ((a.deadline - a.start === b.deadline - b.start) ?
    a.duration === b.duration
      ? a.start === b.start
        ? a.deadline - b.deadline
        : a.start - b.start
      : a.duration - b.duration
    :
    ((a.deadline - a.start) - (b.deadline - b.start))));
  for (let arrItr = 0; arrItr < arr.length; arrItr += 1) {
    // console.log("");
    const { goalid } = arr[arrItr];
    let { duration } = arr[arrItr];
    // if (["project a", "work"].includes(title)) console.log("🚀 ~ file: MiniScheduler.ts:182 ~ operator ~ arrItr:", arrItr);
    // if (["project a", "work"].includes(title)) { console.log(title, duration, dueTaskHrs[goalid]); }
    const pastDue = getDueHrs(goalid);
    if (pastDue && pastDue > 0) {
      // console.log("due exist");
      const currentBuffer = getBufferValue(goalid);
      if (currentBuffer && currentBuffer.length > 0) {
        // console.log("found buffer", buffer[goalid][0]);
        if (currentBuffer[0].nextBuffer === selectedDay) {
          const bufferForToday = currentBuffer[0].availableBuffer;
          if (pastDue >= bufferForToday) {
            duration += bufferForToday;
            updateDueHrs(goalid, pastDue - bufferForToday);
          } else {
            duration += pastDue;
            updateDueHrs(goalid, 0);
            updateBufferOfTheDay(goalid, 0, { ...currentBuffer[0], availableBuffer: bufferForToday - pastDue }
            );
          }
        }
      }
    }
    const currentBuffer = getBufferValue(goalid);
    // if (["project a", "work"].includes(title)) { console.log("after adding due", title, duration, dueTaskHrs[goalid]); }
    if (currentBuffer && currentBuffer.length > 0 && currentBuffer[0].nextBuffer === selectedDay) {
      updateBufferOfGoal(goalid, [...currentBuffer.slice(1)]);
    }
    currentHrs = [...taskScheduler({ ...arr[arrItr], duration }, selectedDay, tmpStart, currentHrs)];
  }
  return currentHrs;
};

export const callJsScheduler = (inputObj: {
  startDate: string,
  endDate: string,
  goals: { [id: string]: ISchedulerInputGoal }
}) => {
  resetAll();
  const { startDate, endDate, goals } = inputObj;
  const tmpStart = new Date(startDate);
  const soloGoals = breakTheTree(goals);
  taskGenerator(soloGoals, tmpStart);
  console.log(getTasksOfDay(1));
  for (let ele = 0; ele < 7; ele += 1) {
    initScheduled(ele + 1);
    initImpossible(ele + 1);
  }

  let tmpDate = new Date(tmpStart);
  for (let item = 0; item < 7; item += 1) {
    let hrsOfDay = [...Array(24).keys()].map(() => -1);
    hrsOfDay = [...operator(item, tmpStart, hrsOfDay)];
    const flexibleWeeklyGoals = getFlexibleWeeklyGoals();
    for (let wgi = 0; wgi < flexibleWeeklyGoals.length; wgi += 1) {
      const { deadline: actualGoalDeadline, title } = goals[flexibleWeeklyGoals[wgi].slot.goalid];
      if (actualGoalDeadline && new Date(actualGoalDeadline) < tmpDate) {
        continue;
      }
      if (flexibleWeeklyGoals[wgi].validDays.includes(convertDateToDay(tmpDate))) {
        const task = { ...flexibleWeeklyGoals[wgi].slot };
        const pastDue = getDueHrs(task.goalid);
        const dueDuration = pastDue || task.duration;
        updateDueHrs(task.goalid, 0);
        if (task.duration !== 0) {
          hrsOfDay = [...taskScheduler({ ...task, duration: dueDuration }, item + 1, tmpStart, hrsOfDay)];
          flexibleWeeklyGoals[wgi] = { ...flexibleWeeklyGoals[wgi], slot: { ...task, duration: dueDuration } };
        }
      }
    }
    tmpDate = new Date(tmpDate.setDate(tmpDate.getDate() + 1));
  }

  const dueTasks = Object.keys(getAllDueTasks());
  // console.log("🚀 ~ file: MiniScheduler.ts:320 ~ dueTaskHrs:", dueTaskHrs);
  // console.log("🚀 ~ file: MiniScheduler.ts:251 ~ dueTasks:", blockingSlots);
  for (let dti = 0; dti < dueTasks.length; dti += 1) {
    const dueGoalId = dueTasks[dti];
    fillUpImpSlotsForGoalId(dueGoalId, 8);
  }
  const resSchedule: { day: string; tasks: IFinalOutputSlot[] }[] = [];
  const resImpossible: { day: string; tasks: IFinalOutputSlot[] }[] = [];
  const scheduled = getScheduledObj();
  const impossible = getImpossibleObj();
  for (let item = 0; item < 7; item += 1) {
    const thisDate = new Date(tmpStart.setDate(tmpStart.getDate() + 1));
    scheduled[item + 1].outputs.sort((a, b) => {
      const s1 = Number(a.start.slice(11, 13));
      const s2 = Number(b.start.slice(11, 13));
      const e1 = Number(a.start.slice(14, 16));
      const e2 = Number(b.start.slice(14, 16));
      if (s1 === s2) {
        return e1 - e2;
      }
      return s1 - s2;
    });
    impossible[item + 1].outputs.sort((a, b) => {
      const s1 = Number(a.start.slice(11, 13));
      const s2 = Number(b.start.slice(11, 13));
      const e1 = Number(a.start.slice(14, 16));
      const e2 = Number(b.start.slice(14, 16));
      if (s1 === s2) {
        return e1 - e2;
      }
      return s1 - s2;
    });
    resSchedule.push({
      day: thisDate.toISOString().slice(0, 10),
      tasks: scheduled[item + 1].outputs,
    });
    resImpossible.push({
      day: thisDate.toISOString().slice(0, 10),
      tasks: impossible[item + 1].outputs,
    });
  }
  return {
    scheduled: resSchedule,
    impossible: resImpossible,
  };
};
