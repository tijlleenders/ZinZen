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

export const completeTask = async (goalId: string, taskId: string, duration: number) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection.where("id").equals(goalId)
      .modify((obj: TaskItem) => {
        const { lastCompleted } = obj;
        lastCompleted.taskIds.push(taskId);
        lastCompleted.date = new Date().toLocaleDateString();
        obj.lastCompleted = { ...lastCompleted };
        obj.hoursSpent += duration;
        if (obj.currentStatus?.date === new Date().toLocaleDateString()) {
          obj.currentStatus.count += duration;
        } else {
          obj.currentStatus = { date: new Date().toLocaleDateString(), count: duration };
        }
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const forgetTask = async (goalId: string, taskId: string, duration: number) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection.where("id").equals(goalId)
      .modify((obj: TaskItem) => {
        const { lastForget } = obj;
        lastForget.taskIds.push(taskId);
        lastForget.date = new Date().toLocaleDateString();
        obj.lastForget = { ...lastForget };
        obj.hoursSpent += duration;
        if (obj.currentStatus?.date === new Date().toLocaleDateString()) {
          obj.currentStatus.count += duration;
        } else {
          obj.currentStatus = { date: new Date().toLocaleDateString(), count: duration };
        }
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
