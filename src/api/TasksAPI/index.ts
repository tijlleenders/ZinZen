/* eslint-disable no-param-reassign */
import { db } from "@models";
import { blockedSlotOfTask, TaskItem } from "@src/models/TaskItem";
import { GoalItem } from "@src/models/GoalItem";
import { calDays, convertDateToString, getLastDayDate } from "@src/utils";
import { convertDateToDay } from "@src/utils/SchedulerUtils";
import { ITask } from "@src/Interfaces/Task";
import { ISchedulerInputGoal } from "@src/Interfaces/IScheduler";
import { getGoal } from "../GoalsAPI";

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

export const getForgetHrsCount = (task: TaskItem) => {
  let yesterdaysCount = 0;
  task.forgotToday.forEach((slot) => {
    const [start, end] = slot.split("-");
    yesterdaysCount += Number(end) - Number(start);
  });
  return yesterdaysCount;
};

export const resetProgressOfToday = async () => {
  const tasks = await db.taskCollection.toArray();
  try {
    await db.transaction("rw", db.taskCollection, async () => {
      const updatedRows = tasks.map((_task) => {
        const task = { ..._task };
        task.completedToday = 0;
        task.completedTodayIds = [];
        task.forgotToday = [];
        task.lastCompleted = new Date().toLocaleDateString();
        task.lastForget = new Date().toLocaleDateString();
        task.blockedSlots = [];
        return task;
      });

      // Bulk update the rows
      await db.taskCollection.bulkPut(updatedRows);
    });
  } catch (error) {
    console.error("Error updating field:", error);
  }
};

export const refreshTaskCollection = async () => {
  const tasks = await db.taskCollection.toArray();
  const goals: { [key: string]: GoalItem } = (await Promise.all(tasks.map((ele) => getGoal(ele.goalId)))).reduce(
    (acc, curr) => {
      return curr ? { ...acc, [curr.id]: { ...curr } } : acc;
    },
    {},
  );
  try {
    await db.transaction("rw", db.taskCollection, async () => {
      const updatedRows = tasks.map((_task) => {
        const task = { ..._task };
        const goal: GoalItem = goals[task.goalId];
        const startDate = new Date(goal.start || goal.createdAt);
        if (goal.habit === "daily") {
          task.hoursSpent = 0;
        } else if (goal.habit === "weekly") {
          const dayIndex = calDays.indexOf(convertDateToDay(startDate));
          const lastReset = getLastDayDate(dayIndex);
          const lastAction = new Date(
            new Date(task.lastForget) < new Date(task.lastCompleted) ? task.lastCompleted : task.lastForget,
          );
          if (lastAction < lastReset) {
            task.hoursSpent = 0;
          } else {
            task.hoursSpent += task.completedToday + getForgetHrsCount(task);
          }
        } else {
          task.hoursSpent += task.completedToday + getForgetHrsCount(task);
        }
        task.completedToday = 0;
        task.completedTodayIds = [];
        task.forgotToday = [];
        task.lastCompleted = new Date().toLocaleDateString();
        task.lastForget = new Date().toLocaleDateString();
        return task;
      });

      // Bulk update the rows
      await db.taskCollection.bulkPut(updatedRows);
    });
  } catch (error) {
    console.error("Error updating field:", error);
  }
};
export const completeTask = async (id: string, duration: number, task: ITask) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection
      .where("id")
      .equals(id)
      .modify((obj: TaskItem) => {
        obj.completedToday += duration;
        obj.completedTodayTimings.push({
          goalid: task.goalid,
          start: task.start,
          deadline: task.deadline,
        });
        obj.completedTodayIds.push(task.taskid);
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const forgetTask = async (id: string, period: string, task: ITask) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection
      .where("id")
      .equals(id)
      .modify((obj: TaskItem) => {
        obj.forgotToday.push(period);
        obj.completedTodayTimings.push({
          goalid: task.goalid,
          start: task.start,
          deadline: task.deadline,
        });
        if (obj.forgotToday.length > 1) {
          obj.forgotToday.sort((a, b) => Number(a.split("-")[0]) - Number(b.split("-")[0]));
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

export const addBlockedSlot = async (goalId: string, slot: { start: string; end: string }) => {
  db.transaction("rw", db.taskCollection, async () => {
    await db.taskCollection
      .where("goalId")
      .equals(goalId)
      .modify((obj: TaskItem) => {
        obj.blockedSlots.push(slot);
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
export const updateBlockedSlotsInDB = async (goalId: string, newBlockedSlots: blockedSlotOfTask[]) => {
  try {
    await db.transaction("rw", db.taskCollection, async () => {
      const task = await db.taskCollection.where("goalId").equals(goalId).first();
      if (task) {
        await db.taskCollection.update(task.id, { blockedSlots: newBlockedSlots });
      }
    });
  } catch (error) {
    console.error(`Error updating blocked slots for goalId ${goalId}:`, error);
  }
};

export const adjustNotOnBlocks = async (goals: ISchedulerInputGoal[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const updatePromises: Promise<void>[] = [];

  const adjustedGoals = goals.map((goal) => {
    if (!goal.notOn || goal.notOn.length === 0) {
      return goal;
    }

    let isUpdated = false;

    const adjustedNotOn = goal.notOn
      .filter((block) => {
        const blockEnd = new Date(block.end);
        return blockEnd > today;
      })
      .map((block) => {
        const blockStart = new Date(block.start);
        if (blockStart < today) {
          isUpdated = true;
          return {
            ...block,
            start: convertDateToString(today),
          };
        }
        return block;
      });

    if (isUpdated || adjustedNotOn.length !== goal.notOn.length) {
      updatePromises.push(updateBlockedSlotsInDB(goal.id, adjustedNotOn));
    }
    return {
      ...goal,
      notOn: adjustedNotOn,
    };
  });

  await Promise.all(updatePromises);
  return adjustedGoals;
};
