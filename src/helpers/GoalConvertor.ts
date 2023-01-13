import { GoalItem } from "@src/models/GoalItem";

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
  response.duration = goal.duration ? ` ${goal.duration}hours` : "";
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
