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
        const today = new Date().toLocaleDateString();
        if (obj.lastCompleted !== today) {
          obj.hoursSpent += obj.completedToday;
          obj.completedToday = duration;
          obj.lastCompleted = today;
        } else {
          obj.completedToday += duration;
        }
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const forgetTask = async (id: string, period: string) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection.where("id").equals(id)
      .modify((obj: TaskItem) => {
        const today = new Date().toLocaleDateString();
        if (obj.lastForget !== today) {
          let yesterdaysCount = 0;
          obj.forgotToday.forEach((slot) => {
            const [start, end] = slot.split("-");
            yesterdaysCount += (Number(end) - Number(start));
          });
          obj.hoursSpent += yesterdaysCount;
          obj.forgotToday = [period];
          obj.lastForget = new Date().toLocaleDateString();
        } else {
          obj.forgotToday.push(period);
        }
        if (obj.forgotToday.length > 1) {
          obj.forgotToday.sort((a, b) => (
            Number(a.split("-")[0]) - Number(b.split("-")[0])
          ));
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
