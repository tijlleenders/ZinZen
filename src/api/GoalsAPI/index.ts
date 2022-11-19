/* eslint-disable no-alert */
// @ts-nocheck

import { db } from "@models";
import { getJustDate } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";
import { v4 as uuidv4 } from "uuid";

export const resetDatabase = () =>
  db.transaction("rw", db.goalsCollection, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });

export const addGoal = async (goalDetails: GoalItem) => {
  const currentDate = getJustDate(new Date());
  const goals: GoalItem = { id: uuidv4(), ...goalDetails, createdAt: currentDate };
  let newGoalId;
  await db
    .transaction("rw", db.goalsCollection, async () => {
      newGoalId = await db.goalsCollection.add(goals);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newGoalId;
};

export const getGoal = async (goalId: string) => {
  const goal: GoalItem[] = await db.goalsCollection.where("id").equals(goalId).toArray();
  return goal[0];
};

export const getChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals: GoalItem[] = await db.goalsCollection.where("parentGoalId").equals(parentGoalId).and((goal) => goal.status === 0).toArray();
  childrenGoals.reverse();
  return childrenGoals;
};

export const getAllGoals = async () => {
  const allGoals = await db.goalsCollection.toArray();
  allGoals.reverse();
  return allGoals;
};

export const getActiveGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("status").equals(0).toArray();
  // Filter and return only parent goals
  const activeParentGoals = activeGoals.filter((goal: GoalItem) => goal.parentGoalId === "root");
  activeParentGoals.reverse();
  return activeParentGoals;
};

export const getAllArchivedGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("status").equals(1).toArray();
  activeGoals.reverse();
  return activeGoals;
};

export const getGoalsFromArchive = async (parentId: string) => {
  const parentIds: string[] = [];
  if (parentId === "root") {
    parentIds.push("root");
  } else {
    const parentGoal = await getGoal(parentId);
    const parentGoals = await db.goalsCollection.where("title").equalsIgnoreCase(parentGoal.title.toLowerCase()).toArray();
    parentGoals.forEach((goal) => {
      parentIds.push(goal.id);
    });
  }
  const archivedGoals = await db.goalsCollection.where("status").equals(1).and((goal) => parentIds.includes(goal.parentGoalId)).toArray();
  archivedGoals.reverse();
  return archivedGoals;
};

export const getGoalsOnDate = async (date: Date) => {
  db.transaction("rw", db.goalsCollection, async () => {
    const goalsList = await db.goalsCollection.where("start").equals(date);
    return goalsList;
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const removeGoal = async (goalId: string) => {
  const goal = await getGoal(goalId);
  const parentGoal = goal.parentGoalId === "root" ? "root" : await getGoal(goal.parentGoalId);
  console.log("inRemoveGoal", goal,);
  db.transaction("rw", db.goalsCollection, async () => {
    const goals = await db.goalsCollection.where("title").equals(goal.title).toArray();
    console.log("here", goals);
    goals.forEach(async (ele) => {
      if (parentGoal === "root") {
        console.log("root");
        if (ele.parentGoalId === "root") await db.goalsCollection.delete(ele.id);
      } else {
        const tmpParentGoal = (await getGoal(ele.parentGoalId)).title;
        if (tmpParentGoal === parentGoal.title) {
          await db.goalsCollection.delete(ele.id);
        }
      }
    });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const updateGoal = async (id: string, changes: object) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(id, changes).then((updated) => updated);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const archiveGoal = async (goal: GoalItem) => {
  const updatedGoalStatus = { status: 1 };
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(goal.id, updatedGoalStatus);
  });
  if (goal.parentGoalId !== -1) {
    const parentGoal = await getGoal(goal.parentGoalId);
    db.transaction("rw", db.goalsCollection, async () => {
      await db.goalsCollection.update(goal.parentGoalId, { sublist: parentGoal.sublist?.filter((ele) => ele !== goal.id) });
    });
  }
};

export const archiveChildrenGoals = async (id: string) => {
  const childrenGoals = await getChildrenGoals(id);
  if (childrenGoals) {
    childrenGoals.forEach(async (goal: GoalItem) => {
      await archiveChildrenGoals(goal.id);
      await archiveGoal(goal);
    });
  }
};

export const archiveUserGoal = async (goal: GoalItem) => {
  await archiveChildrenGoals(goal.id);
  await archiveGoal(goal);
};

export const archiveRootGoalsByTitle = async (goalTitle: string) => {
  const goals: GoalItem[] = await db.goalsCollection.where("parentGoalId").equals("root").and((goal) => goal.title.toLowerCase() === goalTitle.toLowerCase() && goal.status === 0).toArray();
  console.log(goals)
  goals.forEach(async (ele) => {
    await db.goalsCollection.update(ele.id, { status: 1 });
  });
};

export const isCollectionEmpty = async () => {
  const goalsCount = await db.goalsCollection.count();
  if (goalsCount === 0) {
    return true;
  }
  const allGoals = await getAllGoals();
  const archivedGoals = await getAllArchivedGoals();
  return allGoals.length === archivedGoals.length;
};

export const createGoal = (
  goalTitle: string,
  goalRepeats: string | null = null,
  goalDuration: number | null = 1,
  goalStartDT: Date | null = null,
  goalDueDT: Date | null = null,
  goalAfterTime: number | null = null,
  goalBeforeTime: number | null = null,
  goalLang = "English",
  link: string | null = null,
  goalStatus: 0 | 1 = 0,
  parentGoalId = "root",
  goalColor = "#edc7b7",
  shared: null |
  {
    id: string,
    relId: string,
    name: string
  } = null
) => {
  const newGoal: GoalItem = {
    title: goalTitle,
    language: goalLang,
    repeat: goalRepeats,
    duration: goalDuration,
    start: goalStartDT,
    due: goalDueDT,
    afterTime: goalAfterTime,
    beforeTime: goalBeforeTime,
    status: goalStatus,
    parentGoalId,
    goalColor,
    link,
    shared
  };
  return newGoal;
};

export const removeChildrenGoals = async (parentGoalId: string) => {
  const childrenGoals = await getChildrenGoals(parentGoalId);
  console.log("child", childrenGoals);
  if (childrenGoals.length === 0) { return; }
  childrenGoals.forEach((goal) => {
    removeChildrenGoals(goal.id);
    removeGoal(goal.id);
  });
};

export const shareGoal = async (goal: object) => {
  const URL = "https://jb65zz5efi3jy5rw5f2y5ke2u40hobkq.lambda-url.eu-west-1.on.aws/";
  try {
    await fetch(URL, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(goal),
    });
    alert("Thank you for sharing anonymously!");
  } catch (err) {
    alert("Let's focus on the happy path.");
  }
};

export const shareMyGoal = async (goal: GoalItem, parent: string) => {
  const goalDetails = {
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
    link: goal.link
  };
  Object.keys(goalDetails).forEach((key) => {
    if (!goalDetails[key]) {
      delete goalDetails[key];
    }
  });
  const shareableGoal = {
    method: "shareGoal",
    parentTitle: parent,
    goal: goalDetails
  };
  await shareGoal(shareableGoal);
};

export const getPublicGoals = async (goalTitle: string) => {
  const URL = "https://jb65zz5efi3jy5rw5f2y5ke2u40hobkq.lambda-url.eu-west-1.on.aws/";
  const errorMessage = ["Uh oh, do you have internet?", "No internet. Have aliens landed?", "Oops. The internet seems broken..."];

  try {
    const response = await (await fetch(URL, {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        method: "getGoalSuggestions",
        parentTitle: goalTitle
      }),
    })).json();
    return { status: true, data: [...response.Items] };
  } catch (err) {
    console.log(err);
    return { status: false, message: errorMessage[Math.floor(Math.random() * errorMessage.length)] };
  }
};
