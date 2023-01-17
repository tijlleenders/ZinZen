import { GoalItem } from "@src/models/GoalItem";
import { colorPallete } from "@src/utils";
import { v4 as uuidv4 } from "uuid";

export const formatTagsToText = (_goal: GoalItem) => {
  const goal = { ..._goal };
  if (goal.start) { goal.start = new Date(goal.start); }
  if (goal.due) { goal.due = new Date(goal.due); }

  const response = { title: "", duration: "", start: "", due: "", repeat: "", timing: "", link: "", language: goal.language, goalColor: goal.goalColor };
  if (goal.afterTime && goal.beforeTime) {
    response.timing = ` ${goal.afterTime}-${goal.beforeTime}`;
  } else if (goal.afterTime) {
    response.timing = ` after ${goal.afterTime}`;
  } else if (goal.beforeTime) {
    response.timing = ` before ${goal.beforeTime}`;
  }
  response.title = goal.title;
  response.duration = goal.duration ? ` ${goal.duration}h` : "";
  response.start = goal.start ? ` start ${goal.start.getDate()}/${goal.start.getMonth() + 1} @${goal.start.getHours()}` : "";
  response.due = goal.due ? ` due ${goal.due.getDate()}/${goal.due.getMonth() + 1} @${goal.due.getHours()}` : "";
  response.repeat = goal.repeat ? ` ${goal.repeat}` : "";
  response.link = goal.link ? ` ${goal.link}` : "";
  const { title,
    duration,
    start,
    due,
    repeat,
    link,
    timing } = response;
  return { inputText: title + duration + start + due + timing + repeat + link, ...response };
};

export const createGoalObjectFromTags = (obj: object) => {
  const newGoal: GoalItem = {
    id: uuidv4(),
    title: "",
    language: "English",
    repeat: null,
    duration: null,
    start: null,
    due: null,
    afterTime: null,
    beforeTime: null,
    archived: "false",
    parentGoalId: "root",
    link: null,
    sublist: [],
    goalColor: colorPallete[Math.floor(Math.random() * 11)],
    shared: null,
    collaboration: {
      status: "none",
      newUpdates: false,
      relId: "",
      name: "",
      rootGoal: "",
      notificationCounter: 0,
      allowed: true
    },
    ...obj
  };
  return newGoal;
};
