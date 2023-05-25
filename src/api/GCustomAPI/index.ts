/* eslint-disable no-param-reassign */
import { db } from "@models";
import { GCustomItem } from "@src/models/GCustomItem";
import { GoalItem } from "@src/models/GoalItem";

export const addGoalFancyProps = async (goal: GCustomItem) => {
  let newGoalId;
  await db
    .transaction("rw", db.customizationCollection, async () => {
      newGoalId = await db.customizationCollection.add(goal);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newGoalId;
};

export const getGoalFancyProps = async (goalId: string) => {
  const goal: GCustomItem[] = await db.customizationCollection.where("goalId").equals(goalId).toArray();
  return goal.length > 0 ? goal[0] : null;
};

export const updatePositionIndex = async (goalId: string, posIndex: number) => {
  const res = await getGoalFancyProps(goalId);
  if (res) {
    db.transaction("rw", db.customizationCollection, async () => {
      await db.customizationCollection.where("goalId").equals(goalId)
        .modify((obj) => {
          obj.posIndex = posIndex;
        });
    }).catch((e) => {
      console.log(e.stack || e);
    });
  } else {
    await addGoalFancyProps({ goalId, posIndex });
  }
};

export const sortGoalsByProps = async (goals: GoalItem[]) => {
  const ids = goals.map((ele) => ele.id);
  const customCollection: GCustomItem[] = await db.customizationCollection.where("goalId").anyOf(ids).toArray();
  const posIndexMap : { [key: string]: number } = customCollection.reduce((map: { [key: string]: number }, item) => {
    map[item.goalId] = item.posIndex;
    return map;
  }, {});

  // Sort the activeGoals array based on posIndex
  goals.sort((a, b) => {
    const posIndexA = posIndexMap[a.id] || 0; // Default to 0 if posIndex is not found
    const posIndexB = posIndexMap[b.id] || 0; // Default to 0 if posIndex is not found
    return posIndexA - posIndexB;
  });
  return goals;
};
