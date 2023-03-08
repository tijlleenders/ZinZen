/* eslint-disable no-continue */
import { IMSInputGoal } from "@src/Interfaces/ISchedulerInputGoal";
import { addFreeSlots, BookSlots, convertDateToDay, get24Slots, getDurations, getHrInDate, getNecessaryParams, sortTheGoals } from "@src/utils/SchedulerUtils";

const globalSlots = get24Slots();
let schedulerSlots = {};
let impossibleTasks = {};
let output : { [k: string] : {
  bookedBy: string;
  booked: boolean;
}[] } = { };
let debug = false;

const tryToAddThisGoal = (goal: IMSInputGoal, day: string, date: Date) => {
  const { title } = goal;
  const { front, back, actualDuration } = getNecessaryParams(goal);
  const { remainingHr, newGlobalslots, assignedSlots } = BookSlots(goal, output[day], front, back, actualDuration);
  if (debug) console.log({ day, title, status: remainingHr === 0 ? "Scheduled" : "Impossible", allotedSlots: `${assignedSlots.length}`, assignedSlots });
  const dateStr = date.toLocaleDateString();
  if (remainingHr === 0) {
    output[day] = [...newGlobalslots];
    const newASlots = assignedSlots.map((item) => {
      const { startDateFormat, deadlineFormat } = getHrInDate(new Date(date), item);
      return { ...item, start: startDateFormat, deadline: deadlineFormat
      };
    });
    schedulerSlots[dateStr] = [...(schedulerSlots[dateStr] || []), ...newASlots];
  } else {
    impossibleTasks[dateStr] = [...(impossibleTasks[dateStr] || []), ...newASlots];
  }
};

const createScheduleForDay = (date: Date, tmpInputGoals: IMSInputGoal[]) => {
  const day = convertDateToDay(date);
  output[day] = [...globalSlots];
  const inputGoals = [...sortTheGoals(tmpInputGoals)];
  const dailyGoals = inputGoals.filter((goal) => goal.repeat && goal.repeat.toLowerCase() === "daily");
  dailyGoals.forEach((goal: IMSInputGoal) => {
    tryToAddThisGoal(goal, day, new Date(date));
  });
};

const tryThisWeeklyGoal = (goal: IMSInputGoal, StartDate: Date, endDate: Date, outputSlots) => {
  const outputSlotsTemp = { ...outputSlots };
  const { front, back, actualDuration } = getNecessaryParams(goal);
  let totalDurationLeft = actualDuration;
  const slotsOnDays = { };
  let breakout = false;
  const thisDate = StartDate;
  for (let i = StartDate.getDate(); i < endDate.getDate(); i += 1) {
    const day = convertDateToDay(thisDate);
    if ((goal.repeat && goal.repeat === "weekdays" && ["Sunday", "Saturday"].includes(day)) ||
       (goal.repeat && goal.repeat === "weekends" && !["Sunday", "Saturday"].includes(day))) {
      // console.log(day, thisDate);
      thisDate.setDate(thisDate.getDate() + 1);
      continue;
    }
    const dateStr = thisDate.toLocaleDateString();
    const { remainingHr, newGlobalslots, assignedSlots } = BookSlots(goal, outputSlotsTemp[day] || [...globalSlots], front, back, totalDurationLeft, true);
    slotsOnDays[dateStr] = assignedSlots.map((item) => {
      const { startDateFormat, deadlineFormat } = getHrInDate(new Date(thisDate), item);
      return { ...item, start: startDateFormat, deadline: deadlineFormat
      };
    });
    outputSlotsTemp[day] = [...newGlobalslots];
    // if (debug) console.log({ title, status: remainingHr === 0 ? "Scheduled" : "Impossible", allotedSlots: `${assignedSlots.length}`, assignedSlots });
    totalDurationLeft = remainingHr;
    if (totalDurationLeft === 0) {
      breakout = true;
      break;
    }
    thisDate.setDate(thisDate.getDate() + 1);
  }
  console.log(goal.title, totalDurationLeft);
  return { status: breakout, slotsOnDays, outputSlotsTemp };
};
const alreadyDone: string[] = [];
export const handleNLevel = (goals, startDate, endDate, OP, level = "root") => {
  const hierarchicalGoals = goals.filter((goal) => (goal.children && goal.children.length > 0 && level === goal.parentGoalId));
  const inputGoalsObj = goals.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
  for (let p = 0; p < hierarchicalGoals.length; p += 1) {
    const goal = hierarchicalGoals[p];
    alreadyDone.push(goal.id);
    const { goalDuration, diff } = getDurations(goal);
    let duration = goalDuration;
    const hierGoals = [];
    goal.children.forEach((id) => {
      const child = inputGoalsObj[id];
      duration -= Number(child.duration);
      hierGoals.push(child);
      alreadyDone.push(child.id);
    });
    const fillerDuration = duration > diff ? duration - diff : 0;
    if (duration >= 0) {
      let nextLevelDive = false;
      if (duration > 0) { hierGoals.push({ ...goal, title: `${goal.title} filler`, duration: fillerDuration }); }
      let success = true;
      const assignedSlotsOfGoal = {};
      let outputCopy = { ...OP };
      for (let i = 0; i < hierGoals.length; i += 1) {
        const hGoal = hierGoals[i];
        // console.log(goal.title, hGoal.id, hGoal.title);
        if (hGoal.children && hGoal.children.length > 0 && hGoal.id !== goal.id) {
          nextLevelDive = true;
          // console.log(outputCopy);
          const res = handleNLevel(goals, new Date(startDate), new Date(endDate), outputCopy, hGoal.parentGoalId);
          const { levelSuccess, levelOutput } = res;
          outputCopy = { ...levelOutput };
          success = levelSuccess;
          // console.log("vie", hGoal.title, success, outputCopy);
        } else {
          // console.log("no dive", hGoal.title, hGoal.duration);
          const hStartDate = goal.start ? new Date(goal.start) : new Date(startDate);
          const hEndDate = goal.deadline ? new Date(goal.deadline) : new Date(endDate);
          const { status, outputSlotsTemp, slotsOnDays } = tryThisWeeklyGoal({ ...hGoal, repeat: "weekly" }, hStartDate, hEndDate, outputCopy);
          // console.log(outputSlotsTemp);
          outputCopy = { ...outputSlotsTemp };
          assignedSlotsOfGoal[hGoal.id] = { ...slotsOnDays };
          nextLevelDive = false;
          // console.log(hGoal.title, status);
          if (success) { success = status; } else break;
        }
      }
      // console.log("outofloop", success, nextLevelDive);
      if (!nextLevelDive) {
        Object.keys(assignedSlotsOfGoal).forEach((goalid) => {
          Object.keys(assignedSlotsOfGoal[goalid]).forEach((slotsOfDay) => {
            if (success) {
              schedulerSlots[slotsOfDay] = [...(schedulerSlots[slotsOfDay] || []), ...assignedSlotsOfGoal[goalid][slotsOfDay]];
            } else {
              impossibleTasks[slotsOfDay] = [...(impossibleTasks[slotsOfDay] || []), ...assignedSlotsOfGoal[goalid][slotsOfDay]];
            }
          });
        });
      }
      // console.log(level, success);
      if (level === "root" && success) {
        // console.log(outputCopy);
        output = { ...outputCopy };
      }
      // console.log(goal.title, success);
      return { levelSuccess: success, levelOutput: success ? outputCopy : output };
    }
  }
  // console.log("out", level, hierarchicalGoals);
};

export const callMiniScheduler = (inputObj: {
    startDate: string, endDate: string, goals: IMSInputGoal[]
}) => {
  const { startDate, endDate, goals } = inputObj;
  const StartDate = new Date(startDate);
  [...Array(7).keys()].forEach(() => {
    createScheduleForDay(new Date(StartDate), goals);
    StartDate.setDate(StartDate.getDate() + 1);
  });

  debug = true;
  handleNLevel(goals, new Date(startDate), new Date(endDate), output);
  goals.forEach((goal: IMSInputGoal) => {
    const wStartDate = goal.start ? new Date(goal.start) : new Date(startDate);
    const wEndDate = goal.deadline ? new Date(goal.deadline) : new Date(endDate);
    if (!alreadyDone.includes(goal.id) && goal.repeat && goal.repeat.toLowerCase().includes("week")) {
      const { goalDuration, diff } = getDurations(goal);
      const fillerDuration = goalDuration > diff ? goalDuration - diff : 0;
      const { status, outputSlotsTemp, slotsOnDays } = tryThisWeeklyGoal({ ...goal, duration: fillerDuration }, new Date(wStartDate), new Date(wEndDate), output);
      if (status) {
        output = { ...outputSlotsTemp };
      }
      Object.keys(slotsOnDays).forEach((slotsOfDay) => {
        if (status) {
          schedulerSlots[slotsOfDay] = [...(schedulerSlots[slotsOfDay] || []), ...slotsOnDays[slotsOfDay]];
        } else {
          impossibleTasks[slotsOfDay] = [...(impossibleTasks[slotsOfDay] || []), ...slotsOnDays[slotsOfDay]];
        }
      });
    }
  });
  console.log(schedulerSlots, impossibleTasks);
  const scheduled = [];
  const impossible = [];
  Object.keys(schedulerSlots).forEach((dateStr) => {
    schedulerSlots[dateStr].sort((a, b) => Number(a.start.slice(11, 13)) - Number(b.start.slice(11, 13)));
    scheduled.push({ day: dateStr, outputs: addFreeSlots(schedulerSlots[dateStr] || []) });
    impossible.push({ day: dateStr, outputs: impossibleTasks[dateStr] || [] });
  });
  schedulerSlots = {};
  impossibleTasks = [];
  output = { };
  debug = false;
  return { scheduled, impossible };
};
