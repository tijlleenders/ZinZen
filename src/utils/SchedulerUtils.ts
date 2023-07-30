/* eslint-disable vars-on-top */
import { ISchedulerInputGoal } from "@src/Interfaces/ISchedulerInputGoal";

/* eslint-disable no-var */
export const convertDateToDay = (date: Date) => `${date.toLocaleDateString("en-us", { weekday: "long" })}`.slice(0, 3);

type incomingGoals = { [id: string]: ISchedulerInputGoal }

var visited: string[] = [];
var soloGoals: incomingGoals = {};

function traverseTheTree(id: string, goals: incomingGoals) {
  visited.push(id);
  const parent = goals[id];
  const { children } = parent;
  let parentDuration = parent.min_duration;

  if (!children) {
    soloGoals[id] = { ...goals[id], min_duration: parentDuration };
    return parentDuration;
  }

  for (let i = 0; i < children.length; i += 1) {
    const occupied = traverseTheTree(children[i], goals);
    if (parentDuration) parentDuration -= occupied;
  }
  if (parentDuration && parentDuration > 0) {
    soloGoals[id] = { ...goals[id], min_duration: parentDuration };
  }

  return parent.min_duration;
}

export const breakTheTree = (goals: incomingGoals) => {
  visited = [];
  soloGoals = {};
  const goalKeys = Object.keys(goals);
  for (let i = 0; i < goalKeys.length; i += 1) {
    const goal = goals[goalKeys[i]];
    if (goal.children) {
      traverseTheTree(goal.id, goals);
    }
  }
  for (let i = 0; i < goalKeys.length; i += 1) {
    const goal = goals[goalKeys[i]];
    if (!visited.includes(goal.id)) {
      soloGoals[goal.id] = goal;
    }
  }
  // console.log("🚀 ~ file: SchedulerUtils.ts:50 ~ breakTheTree ~ soloGoals:", soloGoals)
  return { ...soloGoals };
};

export const goalSplitter = (goal: ISchedulerInputGoal) => {
  const res = [];
  if (goal.filters) {
    let splittedGoal = false;
    if (goal.filters.after_time > goal.filters.before_time) {
      splittedGoal = true;
      res.push({
        ...goal,
        min_duration: 24 - goal.filters.after_time,
        filters: {
          ...goal.filters,
          before_time: 24
        }
      });
    }
    res.push({
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
    res.push(goal);
  }
  return res;
};

export function formatDate(date: number, hour: number) {
  const year = new Date().getFullYear();
  const month = new Date().getMonth() + 1;
  const formattedDateString = `${year}-${month.toString().padStart(2, "0")}-${date.toString().padStart(2, "0")}T${hour
    .toString()
    .padStart(2, "0")}:00:00`;
  return formattedDateString;
}

export function replaceHrInDateString(str: string, hr: number) {
  const [fh, sh] = str.split("T");
  return `${fh}T${hr > 9 ? "" : "0"}${hr}${sh.slice(2)}`;
}

export function getHrFromDateString(str: string) {
  return Number(str.slice(11, 13));
}
