/* eslint-disable no-alert */
import { db } from "@models";
import { getJustDate } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";

export const resetDatabase = () =>
  db.transaction("rw", db.goalsCollection, async () => {
    await Promise.all(db.tables.map((table) => table.clear()));
  });

export const addGoal = async (goalDetails: GoalItem) => {
  const currentDate = getJustDate(new Date());
  const goals: GoalItem = { ...goalDetails, createdAt: currentDate };
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

export const removeGoal = async (goalId: number) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.delete(goalId);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getGoal = async (goalId: number) => {
  const goal: GoalItem[] = await db.goalsCollection.where("id").equals(goalId).toArray();
  return goal[0];
};

export const getChildrenGoals = async (parentGoalId: number) => {
  const childrenGoals: GoalItem[] = await db.goalsCollection.where("parentGoalId").equals(parentGoalId).and((goal) => goal.status === 0).toArray();
  return childrenGoals;
};

export const getAllGoals = async () => {
  const allGoals = await db.goalsCollection.toArray();
  return allGoals;
};

export const getActiveGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("status").equals(0).toArray();
  // Filter and return only parent goals
  const activeParentGoals = activeGoals.filter((goal: GoalItem) => goal.parentGoalId === -1);
  return activeParentGoals;
};

export const getAllArchivedGoals = async () => {
  const activeGoals: GoalItem[] = await db.goalsCollection.where("status").equals(1).toArray();
  return activeGoals;
};

export const getGoalsFromArchive = async (parentId: number) => {
  const parentIds: number[] = [];
  if (parentId === -1) {
    parentIds.push(-1);
  } else {
    const parentGoal = await getGoal(parentId);
    const parentGoals = await db.goalsCollection.where("title").equalsIgnoreCase(parentGoal.title.toLowerCase()).toArray();
    parentGoals.forEach((goal) => {
      parentIds.push(goal.id);
    });
  }
  const archivedGoals = await db.goalsCollection.where("status").equals(1).and((goal) => parentIds.includes(goal.parentGoalId)).toArray();
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

export const updateGoal = async (id: number, changes: object) => {
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(id, changes).then((updated) => updated);
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const archiveGoal = async (id: number) => {
  const updatedGoalStatus = { status: 1 };
  db.transaction("rw", db.goalsCollection, async () => {
    await db.goalsCollection.update(id, updatedGoalStatus);
  });
};

export const archiveChildrenGoals = async (id: number) => {
  const childrenGoals = await getChildrenGoals(id);
  if (childrenGoals) {
    childrenGoals.forEach(async (goal: GoalItem) => {
      await archiveChildrenGoals(Number(goal.id));
      await archiveGoal(Number(goal.id));
    });
  }
};

export const archiveUserGoal = async (id: number) => {
  await archiveChildrenGoals(id);
  await archiveGoal(id);
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
  goalRepeats: "Once" | "Daily" | "Weekly" | null,
  goalDuration: number | null,
  goalStart: Date | null,
  goalFinish: Date | null,
  goalStatus: 0 | 1,
  parentGoalId: number | -1,
  goalColor: string,
  goalLang: string,
  link: string | null
) => {
  const newGoal: GoalItem = {
    title: goalTitle,
    language: goalLang,
    repeat: goalRepeats,
    duration: goalDuration,
    start: goalStart,
    finish: goalFinish,
    status: goalStatus,
    parentGoalId,
    goalColor,
    link
  };
  return newGoal;
};

export const removeChildrenGoals = async (parentGoalId: number) => {
  const childrenGoals = await getChildrenGoals(parentGoalId);
  if (childrenGoals.length === 0) { return; }
  childrenGoals.forEach((goal) => {
    removeChildrenGoals(Number(goal.id));
    removeGoal(Number(goal.id));
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
  const shareableGoal = {
    method: "shareGoal",
    parentTitle: parent,
    goal: {
      title: goal.title,
      duration: goal.duration,
      repeat: goal.repeat,
      start: goal.start,
      finish: goal.finish,
      createdAt: goal.createdAt,
      goalColor: goal.goalColor,
      language: goal.language,
      link: goal.link
    }
  };
  shareGoal(shareableGoal);
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
