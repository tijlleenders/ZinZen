/* eslint-disable no-param-reassign */
import { db } from "@models";
import { TaskItem } from "@src/models/TaskItem";

export const addTask = async (taskDetails: TaskItem) => {
  let newTaskId;
  await db
    .transaction("rw", db.taskCollection, async () => {
      newTaskId = await db.taskCollection.add(taskDetails);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newTaskId;
};

export const getTaskByGoalId = async (goalId: string) => {
  try {
    const task = await db.taskCollection.where("goalId").equals(goalId).toArray();
    return task[0];
  } catch (err) {
    return null;
  }
};

export const completeTask = async (id: string, duration: number) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection.where("id").equals(id)
      .modify((obj: TaskItem) => {
        obj.lastCompleted = new Date().toLocaleDateString();
        obj.hoursSpent += duration;
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const forgetTask = async (id: string, duration: number) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection.where("id").equals(id)
      .modify((obj: TaskItem) => {
        obj.lastForget = new Date().toLocaleDateString();
        obj.hoursSpent += duration;
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getAllTasks = async () => {
  const allGoals = await db.taskCollection.toArray();
  allGoals.reverse();
  return allGoals;
};

export const getAllBlockedTasks = async () => {
  const tasks = await getAllTasks();
  return tasks.reduce((acc, curr) => ({ ...acc, [curr.goalId]: curr.blockedSlots }), {});
};

export const addBlockedSlot = async (goalId: string, slot: { start: string, end: string }) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection.where("goalId").equals(goalId)
      .modify((obj: TaskItem) => {
        obj.blockedSlots.push(slot);
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
