/* eslint-disable import/no-cycle */
/* eslint-disable no-await-in-loop */
import { getGoal } from "@src/api/GoalsAPI";
import { getInboxItem } from "@src/api/InboxAPI";
import { ITags } from "@src/Interfaces/ITagExtractor";
import { GoalItem } from "@src/models/GoalItem";
import { changesInGoal, IChangesInGoal, InboxItem, typeOfChange } from "@src/models/InboxItem";
import { colorPallete, getDefaultValueOfCollab, getDefaultValueOfShared } from "@src/utils";
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
    rootGoalId: "root",
    link: null,
    sublist: [],
    goalColor: colorPallete[Math.floor(Math.random() * 11)],
    shared: getDefaultValueOfShared(),
    collaboration: getDefaultValueOfCollab(),
    typeOfGoal: "myGoal",
    ...obj
  };
  if (newGoal.rootGoalId === "root") { newGoal.rootGoalId = newGoal.id; }
  return newGoal;
};

export const extractFromGoalTags = (goalTags: ITags) => ({
  duration: goalTags.duration ? goalTags.duration.value : null,
  repeat: goalTags.repeats ? goalTags.repeats.value : null,
  link: goalTags.link ? goalTags.link.value?.trim() : null,
  start: goalTags.start ? goalTags.start.value : null,
  due: goalTags.due ? goalTags.due.value : null,
  afterTime: goalTags.afterTime ? goalTags.afterTime.value : null,
  beforeTime: goalTags.beforeTime ? goalTags.beforeTime.value : null,
});

export const convertIntoAnonymousGoal = (goal: GoalItem) => ({
  title: goal.title,
  duration: goal.duration,
  repeat: goal.repeat,
  start: goal.start,
  due: goal.due,
  afterTime: goal.afterTime,
  beforeTime: goal.beforeTime,
  createdAt: goal.createdAt,
  goalColor: goal.goalColor,
  language: goal.language,
  link: goal.link,
});

export const convertIntoSharedGoal = (goal: GoalItem) => ({
  ...goal,
  shared: getDefaultValueOfShared(),
  collaboration: getDefaultValueOfCollab()
});

export const getHistoryUptoGoal = async (id: string) => {
  const history = [];
  let openGoalOfId = id;
  while (openGoalOfId !== "root") {
    const tmpGoal: GoalItem = await getGoal(openGoalOfId);
    history.push(({
      goalID: tmpGoal.id || "root",
      goalColor: tmpGoal.goalColor || "#ffffff",
      goalTitle: tmpGoal.title || "",
      display: null
    }));
    openGoalOfId = tmpGoal.parentGoalId;
  }
  history.reverse();
  return history;
};