/* eslint-disable no-await-in-loop */
import { v4 as uuidv4 } from "uuid";
import { getGoal } from "@src/api/GoalsAPI";
import { arraysAreEqual, colorPalleteList } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";
import { getInboxItem } from "@src/api/InboxAPI";
import { IChangesInGoal, InboxItem, typeOfChange, typeOfIntent } from "@src/models/InboxItem";
import { ITagsAllowedToDisplay, ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";

export const formatTagsToText = (_goal: GoalItem) => {
  const goal = { ..._goal };
  let startDate = new Date();
  let endDate = new Date();
  if (goal.start) {
    startDate = new Date(goal.start);
  }
  if (goal.due) {
    endDate = new Date(goal.due);
  }
  const response = {
    title: "",
    duration: "",
    start: "",
    due: "",
    habit: "",
    on: "",
    timeBudget: "",
    timing: "",
    link: "",
    language: goal.language,
    goalColor: goal.goalColor,
  };
  if ((goal.afterTime || goal.afterTime === 0) && goal.beforeTime) {
    response.timing = ` ${goal.afterTime}-${goal.beforeTime}`;
  } else if (goal.afterTime || goal.afterTime === 0) {
    response.timing = ` after ${goal.afterTime}`;
  } else if (goal.beforeTime) {
    response.timing = ` before ${goal.beforeTime}`;
  }
  response.title = goal.title;
  response.duration = goal.duration ? ` ${goal.duration}h` : "";
  response.start = goal.start
    ? ` start ${startDate.getDate()}/${startDate.getMonth() + 1} @${startDate.getHours()}`
    : "";
  response.due = goal.due ? ` due ${endDate.getDate()}/${endDate.getMonth() + 1} @${endDate.getHours()}` : "";
  response.habit = goal.habit ? ` ${goal.habit}` : "";
  response.on = goal.on ? `${goal.on.join(" ")}` : "";
  response.timeBudget = JSON.stringify(goal.timeBudget);
  response.link = goal.link ? ` ${goal.link}` : "";
  const { title, duration, start, due, habit, on, timeBudget, link, timing } = response;
  return { inputText: title + duration + start + due + timing + on + timeBudget + habit + link, ...response };
};

export const createGoalObjectFromTags = (obj: object = {}) => {
  const newGoal: GoalItem = {
    id: uuidv4(),
    title: "",
    language: "English",
    habit: null,
    on: null,
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
    goalColor: colorPalleteList[Math.floor(Math.random() * colorPalleteList.length)],
    typeOfGoal: "myGoal",
    createdAt: "",
    participants: [],
    newUpdates: false,
    category: "Standard",
    ...obj,
  };
  if (newGoal.rootGoalId === "root") {
    newGoal.rootGoalId = newGoal.id;
  }
  return newGoal;
};

export const getHistoryUptoGoal = async (id: string) => {
  const history = [];
  let openGoalOfId = id;
  while (openGoalOfId !== "root") {
    const tmpGoal: GoalItem | null = await getGoal(openGoalOfId);
    if (!tmpGoal) break;
    history.push({
      goalID: tmpGoal.id || "root",
      goalColor: tmpGoal.goalColor || "#ffffff",
      goalTitle: tmpGoal.title || "",
      display: null,
    });
    openGoalOfId = tmpGoal.parentGoalId;
  }
  history.reverse();
  return history;
};

export const getTypeAtPriority = (goalChanges: IChangesInGoal) => {
  let typeAtPriority: typeOfChange | "none" = "none";
  if (goalChanges.subgoals.length > 0) {
    typeAtPriority = "subgoals";
  } else if (goalChanges.modifiedGoals.length > 0) {
    typeAtPriority = "modifiedGoals";
  } else if (goalChanges.archived.length > 0) {
    typeAtPriority = "archived";
  } else if (goalChanges.deleted.length > 0) {
    typeAtPriority = "deleted";
  } else if (goalChanges.restored.length > 0) {
    typeAtPriority = "restored";
  }
  return { typeAtPriority };
};

export const jumpToLowestChanges = async (id: string, relId: string) => {
  const inbox: InboxItem = await getInboxItem(id);
  let typeAtPriority: typeOfChange | "none" = "none";
  if (inbox) {
    const goalChanges = inbox.changes[relId];
    typeAtPriority = getTypeAtPriority(goalChanges).typeAtPriority;
    if (typeAtPriority !== "none") {
      goalChanges[typeAtPriority].sort((a: { level: number }, b: { level: number }) => a.level - b.level);
      let goals: { intent: typeOfIntent; goal: GoalItem }[] = [];
      const goalAtPriority = goalChanges[typeAtPriority][0];
      const parentId =
        "id" in goalAtPriority
          ? goalAtPriority.id
          : typeAtPriority === "subgoals"
            ? goalAtPriority.goal.parentGoalId
            : goalAtPriority.goal.id;

      if (typeAtPriority === "archived" || typeAtPriority === "deleted") {
        return { typeAtPriority, parentId, goals: [await getGoal(parentId)] };
      }
      if (typeAtPriority === "subgoals") {
        goalChanges.subgoals.forEach(({ intent, goal }) => {
          if (goal.parentGoalId === parentId) goals.push({ intent, goal });
        });
      }
      if (typeAtPriority === "modifiedGoals") {
        let modifiedGoal = createGoalObjectFromTags({});
        let goalIntent;
        goalChanges.modifiedGoals.forEach(({ goal, intent }) => {
          if (goal.id === parentId) {
            modifiedGoal = { ...modifiedGoal, ...goal };
            goalIntent = intent;
          }
        });
        goals = [{ intent: goalIntent, goal: modifiedGoal }];
      }

      return {
        typeAtPriority,
        parentId,
        goals,
      };
    }
  } else {
    console.log("inbox item doesn't exist");
  }
  return { typeAtPriority, parentId: "", goals: [] };
};

export const findGoalTagChanges = (goal1: GoalItem, goal2: GoalItem) => {
  const tags: ITagsAllowedToDisplay[] = [
    "title",
    "duration",
    "habit",
    "on",
    "timeBudget",
    "start",
    "due",
    "afterTime",
    "beforeTime",
    "goalColor",
    "language",
    "timeBudget",
  ];
  const res: ITagsChanges = { schemaVersion: {}, prettierVersion: {} };
  const goal1Tags = formatTagsToText(goal1);
  const goal2Tags = formatTagsToText(goal2);

  tags.forEach((tag) => {
    if (tag === "on") {
      const goal1On = goal1.on || [];
      const goal2On = goal2.on || [];
      if (!arraysAreEqual(goal1On, goal2On)) {
        res.schemaVersion[tag] = goal2On || null;
        res.prettierVersion[tag] = {
          oldVal: goal1On.join(" "),
          newVal: goal2On.join(" "),
        };
      }
    } else if (goal1[tag] !== goal2[tag] && tag !== "timeBudget") {
      res.schemaVersion[tag] = goal2[tag] ?? null;
      if (tag === "afterTime" || tag === "beforeTime") {
        res.prettierVersion.timing = { oldVal: goal1Tags.timing, newVal: goal2Tags.timing };
      } else res.prettierVersion[tag] = { oldVal: goal1Tags[tag], newVal: goal2Tags[tag] };
    }
  });
  return res;
};
