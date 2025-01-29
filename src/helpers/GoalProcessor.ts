/* eslint-disable no-await-in-loop */
import { v4 as uuidv4 } from "uuid";
import { getGoal } from "@src/api/GoalsAPI";
import { colorPalleteList } from "@src/utils";
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
    parentGoalId: goal.parentGoalId,
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
  response.parentGoalId = goal.parentGoalId;
  const { title, duration, start, due, habit, on, timeBudget, link, timing, parentGoalId } = response;
  return {
    inputText: title + duration + start + due + timing + on + timeBudget + habit + link + parentGoalId,
    ...response,
  };
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
  } else if (goalChanges.newGoalMoved.length > 0) {
    typeAtPriority = "newGoalMoved";
  } else if (goalChanges.modifiedGoals.length > 0) {
    typeAtPriority = "modifiedGoals";
  } else if (goalChanges.moved.length > 0) {
    typeAtPriority = "moved";
  } else if (goalChanges.archived.length > 0) {
    typeAtPriority = "archived";
  } else if (goalChanges.deleted.length > 0) {
    typeAtPriority = "deleted";
  } else if (goalChanges.restored.length > 0) {
    typeAtPriority = "restored";
  }
  return { typeAtPriority };
};

/**
 * Finds and returns the lowest level changes for a given inbox item and relationship ID
 * @param id - Inbox item ID
 * @param relId - Relationship ID to identify specific changes
 * @returns Object containing type of change, parent ID, and affected goals
 */
export const jumpToLowestChanges = async (id: string, relId: string) => {
  // Fetch the inbox item containing changes
  const inbox: InboxItem = await getInboxItem(id);
  let typeAtPriority: typeOfChange | "none" = "none";

  if (inbox) {
    const goalChanges = inbox.changes[relId];
    // Get the highest priority change type (subgoals > newGoalMoved > modifiedGoals > etc)
    typeAtPriority = getTypeAtPriority(goalChanges).typeAtPriority;

    if (typeAtPriority !== "none") {
      // Sort changes by level (depth in goal hierarchy)
      goalChanges[typeAtPriority].sort((a: { level: number }, b: { level: number }) => a.level - b.level);
      let goals: { intent: typeOfIntent; goal: GoalItem }[] = [];
      const goalAtPriority = goalChanges[typeAtPriority][0];

      // Determine the parent ID based on change type and goal structure
      const parentId =
        "id" in goalAtPriority
          ? goalAtPriority.id
          : typeAtPriority === "subgoals" || typeAtPriority === "newGoalMoved"
            ? goalAtPriority.goal.parentGoalId
            : goalAtPriority.goal.id;

      // Handle archived or deleted goals
      if (typeAtPriority === "archived" || typeAtPriority === "deleted") {
        const result = { typeAtPriority, parentId, goals: [await getGoal(parentId)] };
        return result;
      }

      // Handle subgoals and newly moved goals
      if (typeAtPriority === "subgoals" || typeAtPriority === "newGoalMoved") {
        // Collect all goals that share the same parent ID
        goalChanges[typeAtPriority].forEach(({ intent, goal }) => {
          if (goal.parentGoalId === parentId) goals.push({ intent, goal });
        });
      }

      // Handle modified or moved goals
      if (typeAtPriority === "modifiedGoals" || typeAtPriority === "moved") {
        let modifiedGoal = createGoalObjectFromTags({});
        let goalIntent;
        // Find and merge changes for the specific goal
        goalChanges[typeAtPriority].forEach((change) => {
          if ("goal" in change && change.goal.id === parentId) {
            modifiedGoal = { ...modifiedGoal, ...change.goal };
            goalIntent = change.intent;
          }
        });
        goals = [{ intent: goalIntent, goal: modifiedGoal }];
      }

      const result = {
        typeAtPriority,
        parentId,
        goals,
      };
      return result;
    }
  }

  // Return default result if no changes found
  const defaultResult = { typeAtPriority, parentId: "", goals: [] };
  return defaultResult;
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
    "parentGoalId",
  ];
  const res: ITagsChanges = { schemaVersion: {}, prettierVersion: {} };
  const goal1Tags = formatTagsToText(goal1);
  const goal2Tags = formatTagsToText(goal2);
  console.log(goal1Tags, goal2Tags);
  tags.forEach((tag) => {
    if (goal1[tag] !== goal2[tag] && tag !== "timeBudget") {
      res.schemaVersion[tag] = goal2[tag] || null;
      if (tag === "afterTime" || tag === "beforeTime") {
        res.prettierVersion.timing = { oldVal: goal1Tags.timing, newVal: goal2Tags.timing };
      } else if (tag === "timeBudget") {
        // const g1TB = JSON.parse(goal1Tags.timeBudget);
        // const g2TB = JSON.parse(goal2Tags.timeBudget);
        // if (g1TB.perDay !== g2TB.perDay || g1TB.perWeek !== g2TB.perWeek) {
        //   console.log("in");
        //   const { perDay: oldPerDay, perWeek: oldPerWeek } = g1TB;
        //   const { perDay: newPerDay, perWeek: newPerWeek } = g2TB;
        //   res.prettierVersion[tag] = {
        //     oldVal: `${oldPerDay === "-" ? "" : oldPerDay} ${oldPerWeek === "-" ? "" : oldPerWeek}`,
        //     newVal: `${newPerDay === "-" ? "" : newPerDay} ${newPerWeek === "-" ? "" : newPerWeek}`,
        //   };
        // }
      } else res.prettierVersion[tag] = { oldVal: goal1Tags[tag], newVal: goal2Tags[tag] };
    }
  });
  return res;
};
