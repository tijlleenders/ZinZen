/* eslint-disable no-await-in-loop */
import { v4 as uuidv4 } from "uuid";
import { getGoal } from "@src/api/GoalsAPI";
import { colorPalleteList } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";
import { getInboxItem } from "@src/api/InboxAPI";
import { ITags } from "@src/Interfaces/ITagExtractor";
import { changesInGoal, IChangesInGoal, InboxItem, typeOfChange } from "@src/models/InboxItem";
import { getDefaultValueOfShared, getDefaultValueOfCollab } from "@src/utils/defaultGenerators";
import { ITagsAllowedToDisplay, ITagsChanges } from "@src/Interfaces/IDisplayChangesModal";

// export const createSentFromTags = (goal: GoalItem) =>
//   `${goal.duration ? `${goal.duration} hours ` : ""} ${goal.on.length > 0 ? `on ${goal.on.join(" ")}\n` : ""}${
//     goal.beforeTime && goal.afterTime
//       ? `between ${goal.afterTime}-${goal.beforeTime} `
//       : goal.beforeTime
//       ? `before ${goal.beforeTime} `
//       : goal.afterTime
//       ? `after ${goal.afterTime} `
//       : ""
//   }${goal.timeBudget.perDay ? `${goal.timeBudget.perDay} h / day ` : ""} ${
//     goal.timeBudget.perWeek ? `${goal.timeBudget.perDay ? "," : ""}${goal.timeBudget.perWeek} h / week` : ""
//   }${goal.start ? `starts ${new Date(goal.start).toDateString().slice(4)}\n` : ""} ${
//     goal.due ? `end ${new Date(goal.due).toDateString().slice(4)}\n` : ""
//   }${goal.habit && goal.habit === "weekly" ? "every week\n" : ""}`;

// export const formatTagsToText = (_goal: GoalItem) => {
//   const goal = { ..._goal };
//   if (goal.start) {
//     goal.start = new Date(goal.start);
//   }
//   if (goal.due) {
//     goal.due = new Date(goal.due);
//   }

//   const response = {
//     title: "",
//     duration: "",
//     start: "",
//     due: "",
//     habit: "",
//     on: "",
//     timeBudget: "",
//     timing: "",
//     link: "",
//     language: goal.language,
//     goalColor: goal.goalColor,
//   };
//   if ((goal.afterTime || goal.afterTime === 0) && goal.beforeTime) {
//     response.timing = ` ${goal.afterTime}-${goal.beforeTime}`;
//   } else if (goal.afterTime || goal.afterTime === 0) {
//     response.timing = ` after ${goal.afterTime}`;
//   } else if (goal.beforeTime) {
//     response.timing = ` before ${goal.beforeTime}`;
//   }
//   response.title = goal.title;
//   response.duration = goal.duration ? ` ${goal.duration}h` : "";
//   response.start = goal.start
//     ? ` start ${goal.start.getDate()}/${goal.start.getMonth() + 1} @${goal.start.getHours()}`
//     : "";
//   response.due = goal.due ? ` due ${goal.due.getDate()}/${goal.due.getMonth() + 1} @${goal.due.getHours()}` : "";
//   response.habit = goal.habit ? ` ${goal.habit}` : "";
//   response.on = goal.on ? `${goal.on}` : "";
//   response.timeBudget = goal.timeBudget
//     ? `${goal.timeBudget.duration}hr${Number(goal.timeBudget.duration) > 1 ? "s" : ""} / ${goal.timeBudget.period}`
//     : "";
//   response.link = goal.link ? ` ${goal.link}` : "";
//   const { title, duration, start, due, habit, on, timeBudget, link, timing } = response;
//   return { inputText: title + duration + start + due + timing + on + timeBudget + habit + link, ...response };
// };

export const createGoalObjectFromTags = (obj: object) => {
  const newGoal: GoalItem = {
    id: uuidv4(),
    title: "",
    language: "English",
    habit: null,
    on: [],
    timeBudget: {
      perDay: null,
      perWeek: null,
    },
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
    goalColor: colorPalleteList[Math.floor(Math.random() * 11)],
    shared: getDefaultValueOfShared(),
    collaboration: getDefaultValueOfCollab(),
    typeOfGoal: "myGoal",
    ...obj,
  };
  if (newGoal.rootGoalId === "root") {
    newGoal.rootGoalId = newGoal.id;
  }
  return newGoal;
};

export const extractFromGoalTags = (goalTags: ITags) => ({
  duration: goalTags.duration ? goalTags.duration.value : null,
  repeat: goalTags.repeats ? goalTags.repeats.value : null,
  link: goalTags.link ? goalTags.link.value?.trim() : null,
  start: goalTags.start ? goalTags.start.value : null,
  due: goalTags.due ? goalTags.due.value : null,
  afterTime: goalTags.afterTime || goalTags.afterTime === 0 ? goalTags.afterTime.value : null,
  beforeTime: goalTags.beforeTime || goalTags.beforeTime === 0 ? goalTags.beforeTime.value : null,
});

export const getHistoryUptoGoal = async (id: string) => {
  const history = [];
  let openGoalOfId = id;
  while (openGoalOfId !== "root") {
    const tmpGoal: GoalItem = await getGoal(openGoalOfId);
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
  }
  return { typeAtPriority };
};

export const jumpToLowestChanges = async (id: string) => {
  const inbox: InboxItem = await getInboxItem(id);
  let typeAtPriority: typeOfChange | "none" = "none";
  if (inbox) {
    const { goalChanges } = inbox;
    typeAtPriority = getTypeAtPriority(goalChanges).typeAtPriority;
    if (typeAtPriority !== "none") {
      goalChanges[typeAtPriority].sort((a: { level: number }, b: { level: number }) => a.level - b.level);
      let goals: GoalItem[] = [];
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
        goalChanges.subgoals.forEach((ele: changesInGoal) => {
          if (ele.goal.parentGoalId === parentId) goals.push(ele.goal);
        });
      }
      if (typeAtPriority === "modifiedGoals") {
        let goal = createGoalObjectFromTags({});
        goalChanges.modifiedGoals.forEach((ele) => {
          if (ele.goal.id === parentId) {
            goal = { ...goal, ...ele.goal };
          }
        });
        goals = [goal];
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
    "link",
  ];
  const res: ITagsChanges = { schemaVersion: {}, prettierVersion: {} };
  const goal1Tags = formatTagsToText(goal1);
  const goal2Tags = formatTagsToText(goal2);
  console.log(goal1Tags, goal2Tags);
  tags.forEach((tag) => {
    if (goal1[tag] !== goal2[tag]) {
      res.schemaVersion[tag] = goal2[tag] || null;
      if (tag === "afterTime" || tag === "beforeTime") {
        res.prettierVersion.timing = { oldVal: goal1Tags.timing, newVal: goal2Tags.timing };
      } else res.prettierVersion[tag] = { oldVal: goal1Tags[tag], newVal: goal2Tags[tag] };
    }
  });
  return res;
};
