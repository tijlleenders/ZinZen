/* eslint-disable vars-on-top */
/* eslint-disable no-var */
/* eslint-disable camelcase */
/* eslint-disable no-continue */
import {
  IFinalOutputSlot,
  ISchedulerInputGoal,
  ISchedulerOutput,
  ISchedulerOutputSlot,
} from "@src/Interfaces/ISchedulerInputGoal";
import { calDays } from "@src/utils";
import { breakTheTree, convertDateToDay } from "@src/utils/SchedulerUtils";
import { v4 as uuidv4 } from "uuid";

function formatDate(date: number, hour: number) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const formattedDateString = `${year}-${month.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}T${hour
    .toString()
    .padStart(2, "0")}:00:00`;
  return formattedDateString;
}
function replaceHrInDateString(str: string, hr: number) {
  const [fh, sh] = str.split("T");
  return `${fh}T${hr > 9 ? "" : "0"}${hr}${sh.slice(2)}`;
}
function getHrFromDateString(str: string) {
  return Number(str.slice(11, 13));
}
var weeklyGoals: {
  slot: ISchedulerOutputSlot;
  validDays: string[];
}[] = [];
var dueTaskHrs: { [goalId: string]: number } = {};
var blockingSlots: { [goalId: string]: IFinalOutputSlot[][] } = {};
var myDays: ISchedulerOutputSlot[][] = [[], [], [], [], [], [], [], []];
var buffer: { [goalId: string]: { nextBuffer: number; availableBuffer: number }[] } = {};
var { scheduled, impossible }: ISchedulerOutput = { scheduled: [], impossible: [] };

const schProcessor = (tmpStart: Date, goal: ISchedulerInputGoal) => {
  blockingSlots[goal.id] = [[], [], [], [], [], [], [], []];
  // const goalStartDate = goal.start ? new Date(goal.start) : new Date();
  const deadline = goal.deadline ? new Date(goal.deadline) : null;
  let totalDuration = goal.min_duration;
  const { after_time = 0, before_time = 24, on_days = calDays, not_on = [] } = goal.filters || {};
  const slot = {
    goalid: goal.id,
    taskid: uuidv4(),
    title: goal.title,
  };
  // if(goal.title === "sleep") { console.log(goal)}
  const validDays = on_days.filter((ele) => !not_on.includes(ele));
  if (goal.repeat || goal.filters?.on_days) {
    if (goal.repeat === "daily") {
      for (let key = 0; key < 7; key += 1) {
        myDays[key + 1] = [...myDays[key + 1], {
          ...slot,
          start: after_time,
          deadline: before_time,
          duration: totalDuration,
        }];
      }
    } else if (!goal.budgets) {
      weeklyGoals.push({
        slot: {
          ...slot,
          start: after_time,
          deadline: before_time,
          duration: totalDuration,
        },
        validDays,
      });
      // console.log("🚀 ~ file: MiniScheduler.ts:73 ~ schProcessor ~ weeklyGoals:", weeklyGoals);
    } else {
      let tmp = new Date(tmpStart);
      const { min } = goal.budgets[0];
      for (let i = 0; i < 7; i += 1) {
        if (deadline && deadline < tmp) {
          break;
        }
        if (validDays.includes(convertDateToDay(tmp))) {
          const slotD = min > totalDuration ? totalDuration : min;
          myDays[i + 1] = [...myDays[i + 1], {
            ...slot,
            start: after_time,
            deadline: before_time,
            duration: slotD,
          }];
          if (min > totalDuration) {
            if (!buffer[goal.id]) {
              buffer[goal.id] = [];
            }
            buffer[goal.id].push({ nextBuffer: i + 1, availableBuffer: min - totalDuration });
          }
          if (totalDuration > 0) {
            totalDuration -= min > totalDuration ? totalDuration : min;
          }
        }
        tmp = new Date(tmp.setDate(tmp.getDate() + 1));
        // if (totalDuration <= 0) { break; }
      }
      if (totalDuration >= 0) { dueTaskHrs[goal.id] = totalDuration + (dueTaskHrs[goal.id] || 0); }
    }
  } else {
    let tmp = new Date(tmpStart);
    const min = totalDuration;
    for (let i = 0; i < 7; i += 1) {
      if (deadline && deadline < tmp) {
        break;
      }
      const slotD = min > totalDuration ? totalDuration : min;
      myDays[i + 1] = [...myDays[i + 1], {
        ...slot,
        start: after_time,
        deadline: before_time,
        duration: slotD,
      }];
      if (min > totalDuration) {
        if (!buffer[goal.id]) {
          buffer[goal.id] = [];
        }
        buffer[goal.id].push({ nextBuffer: i + 1, availableBuffer: min - totalDuration });
      }
      if (totalDuration > 0) {
        totalDuration -= min > totalDuration ? totalDuration : min;
      }
      tmp = new Date(tmp.setDate(tmp.getDate() + 1));
    }
    if (totalDuration >= 0) { dueTaskHrs[goal.id] = totalDuration + (dueTaskHrs[goal.id] || 0); }
  }
};
const schManager = (goals: { [id: string]: ISchedulerInputGoal }, tmpStart: Date) => {
  for (let index = 0; index < Object.keys(goals).length; index += 1) {
    const id = Object.keys(goals)[index];
    const goal = goals[id];
    let splittedGoal = false;
    if (goal.filters) {
      if (goal.filters.after_time > goal.filters.before_time) {
        splittedGoal = true;
        schProcessor(tmpStart, {
          ...goal,
          min_duration: 24 - goal.filters.after_time,
          filters: {
            ...goal.filters,
            before_time: 24
          }
        });
      }
      schProcessor(tmpStart, {
        ...goal,
        ...(splittedGoal ? {
          min_duration: goal.min_duration - (24 - goal.filters.after_time),
          filters: {
            ...goal.filters,
            after_time: 0
          }
        } : {})
      });
    } else {
      schProcessor(tmpStart, goal);
    }
  }
};

const addInBlockingHrs = (task: ISchedulerOutputSlot, tmpStartDate: Date, selectedDay: number, start: number, end: number) => {
  // console.log(task, end, start);

  const predictedDeadline = start + task.duration;
  const actualDeadline = task.deadline < predictedDeadline && task.deadline < end ?
    task.deadline : predictedDeadline > end ?
      end > task.deadline ? task.deadline : end
      : predictedDeadline;
  // if (task.title.includes("work") && selectedDay === 2) {
  //   console.log("🚀 ~ file: MiniScheduler.ts:169 ~ addInBlockingHrs ~ actualDeadline:",
  //     start, actualDeadline, predictedDeadline, end, task);
  // }
  blockingSlots[task.goalid][selectedDay].push({
    ...task,
    start: formatDate(tmpStartDate.getDate() + selectedDay - 1, start),
    deadline: formatDate(tmpStartDate.getDate() + selectedDay - 1, actualDeadline),
    duration: actualDeadline - start,
  });
};
//
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
      addInBlockingHrs({ ...taskObj, duration }, tmpStart, selectedDay, startHr, defaultHrs[startHr]);
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
          scheduled[selectedDay].outputs.push({
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
            addInBlockingHrs({ ...taskObj, duration: tmpD }, tmpStart, selectedDay, ptr, defaultHrs[ptr]);
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
        // if (["project a", "work"].includes(task.title)) { console.log("Incomplete Duration", task.title, tmpD); }
        dueTaskHrs[task.goalid] = (dueTaskHrs[task.goalid] || 0) + tmpD;
      }
      // else if (["project a", "work"].includes(task.title)) { console.log("Duration completed"); }
    }
  }
  return defaultHrs;
};
const operator = (item: number, tmpStart: Date, defaultHrs: number[]) => {
  let currentHrs = [...defaultHrs];
  const selectedDay = item + 1;
  const arr = [...myDays[selectedDay]];
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
    if (dueTaskHrs[goalid] && dueTaskHrs[goalid] > 0) {
      // console.log("due exist");
      if (buffer[goalid] && buffer[goalid].length > 0) {
        // console.log("found buffer", buffer[goalid][0]);
        if (buffer[goalid][0].nextBuffer === selectedDay) {
          const pastDue = dueTaskHrs[goalid];
          const bufferForToday = buffer[goalid][0].availableBuffer;
          if (pastDue >= bufferForToday) {
            duration += bufferForToday;
            dueTaskHrs[goalid] -= bufferForToday;
          } else {
            duration += pastDue;
            dueTaskHrs[goalid] = 0;
            buffer[goalid][0] = { ...buffer[goalid][0], availableBuffer: bufferForToday - pastDue };
          }
        }
      }
    }
    // if (["project a", "work"].includes(title)) { console.log("after adding due", title, duration, dueTaskHrs[goalid]); }
    if (buffer[goalid] && buffer[goalid].length > 0 && buffer[goalid][0].nextBuffer === selectedDay) {
      buffer[goalid] = [...buffer[goalid].slice(1)];
    }
    currentHrs = [...taskScheduler({ ...arr[arrItr], duration }, selectedDay, tmpStart, currentHrs)];
  }
  return currentHrs;
};

export const callMiniScheduler = (inputObj: {
  startDate: string;
  endDate: string;
  goals: { [id: string]: ISchedulerInputGoal };
}) => {
  dueTaskHrs = {};
  myDays = [[], [], [], [], [], [], [], []];
  buffer = {};
  scheduled = [];
  impossible = [];
  weeklyGoals = [];

  const { startDate, endDate, goals } = inputObj;
  const tmpStart = new Date(startDate);
  const soloGoals = breakTheTree(goals);
  schManager(soloGoals, tmpStart);
  // console.log(myDays);
  for (let ele = 0; ele < 7; ele += 1) {
    scheduled[ele + 1] = { day: `${ele + 1}`, outputs: [] };
    impossible[ele + 1] = { day: `${ele + 1}`, outputs: [] };
  }
  let tmpDate = new Date(tmpStart);
  for (let item = 0; item < 7; item += 1) {
    let hrsOfDay = [...Array(24).keys()].map(() => -1);
    hrsOfDay = [...operator(item, tmpStart, hrsOfDay)];
    for (let wgi = 0; wgi < weeklyGoals.length; wgi += 1) {
      const { deadline: actualGoalDeadline, title } = goals[weeklyGoals[wgi].slot.goalid];
      if (actualGoalDeadline && new Date(actualGoalDeadline) < tmpDate) {
        continue;
      }
      if (weeklyGoals[wgi].validDays.includes(convertDateToDay(tmpDate))) {
        const task = { ...weeklyGoals[wgi].slot };
        const dueDuration = dueTaskHrs[task.goalid] || task.duration;
        dueTaskHrs[task.goalid] = 0;
        if (task.duration !== 0) {
          hrsOfDay = [...taskScheduler({ ...task, duration: dueDuration }, item + 1, tmpStart, hrsOfDay)];
          weeklyGoals[wgi] = { ...weeklyGoals[wgi], slot: { ...task, duration: dueDuration } };
        }
      }
    }
    tmpDate = new Date(tmpDate.setDate(tmpDate.getDate() + 1));
  }

  const dueTasks = Object.keys(dueTaskHrs);
  // console.log("🚀 ~ file: MiniScheduler.ts:320 ~ dueTaskHrs:", dueTaskHrs);
  // console.log("🚀 ~ file: MiniScheduler.ts:251 ~ dueTasks:", blockingSlots);
  const usedBlockers: { [id: string]: { [day: number]: number[] } } = {};
  for (let dti = 0; dti < dueTasks.length; dti += 1) {
    const dueGoalId = dueTasks[dti];
    let dueHrs = dueTaskHrs[dueGoalId];
    if (dueHrs) {
      for (let dayItr = 1; dayItr < 8 && dueHrs !== 0; dayItr += 1) {
        const pickSlots = blockingSlots[dueGoalId][dayItr];
        if (pickSlots.length > 0) {
          for (let psIndex = 0; psIndex < pickSlots.length && dueHrs !== 0; psIndex += 1) {
            const thisSlot = pickSlots[psIndex];
            if (usedBlockers[thisSlot.goalid]) {
              if (usedBlockers[thisSlot.goalid][dayItr]?.includes(psIndex)) {
                // if (thisSlot.goalid === "6debddbd-6558-4a1f-9884-1b3467b887cb") { console.log("exists", thisSlot); }
                continue;
              }
              usedBlockers[thisSlot.goalid][dayItr] = [...(usedBlockers[thisSlot.goalid][dayItr] || []), psIndex];
            } else {
              usedBlockers[thisSlot.goalid] = { [dayItr]: [psIndex] };
            }
            // if (thisSlot.goalid === "53a8e2e5-b659-4f1f-8b44-b394158dc49d") { console.log("🚀 ~ file: MiniScheduler.ts:262 ~ thisSlot:", thisSlot, dueHrs, getHrFromDateString(thisSlot.start), (thisSlot.duration - dueHrs)); }
            if (thisSlot.duration > dueHrs) {
              impossible[dayItr].outputs.push({
                ...thisSlot,
                duration: dueHrs,
                deadline: replaceHrInDateString(thisSlot.deadline,
                  getHrFromDateString(thisSlot.start) + (thisSlot.duration - dueHrs))
              });
              dueHrs = 0;
            } else {
              impossible[dayItr].outputs.push({
                ...thisSlot,
              });
              dueHrs -= thisSlot.duration;
            }
          }
        }
      }
    }
  }
  const resSchedule: { day: string; outputs: IFinalOutputSlot[] }[] = [];
  const resImpossible: { day: string; outputs: IFinalOutputSlot[] }[] = [];
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
      outputs: scheduled[item + 1].outputs,
    });
    resImpossible.push({
      day: thisDate.toISOString().slice(0, 10),
      outputs: impossible[item + 1].outputs,
    });
  }
  return {
    scheduled: resSchedule,
    impossible: resImpossible,
  };
};
