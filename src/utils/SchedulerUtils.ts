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
    parentDuration -= occupied;
  }
  if (parentDuration > 0) {
    soloGoals[id] = { ...goals[id], title: `${parent.title} filler`, min_duration: parentDuration };
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
