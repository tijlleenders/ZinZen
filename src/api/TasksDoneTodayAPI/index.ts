import { db } from "@src/models";
import { TasksDoneTodayItem } from "@src/models/TasksDoneTodayItem";

export const addTaskDoneToday = async (completedTask: TasksDoneTodayItem) => {
  await db.tasksDoneTodayCollection.add(completedTask);
};

export const getTaskDoneTodayByTaskId = async (taskId: string) => {
  const task = await db.tasksDoneTodayCollection.where("taskId").equals(taskId).first();
  if (task) {
    return task;
  }
  return false;
};

export const isTaskDoneToday = async (taskId: string) => {
  const task = await getTaskDoneTodayByTaskId(taskId);
  if (task) {
    return true;
  }
  return false;
};

export const getAllTasksDoneToday = async () => {
  const tasks = await db.tasksDoneTodayCollection.toArray();
  return tasks;
};

export const deleteTaskDoneToday = async (id: string) => {
  await db.tasksDoneTodayCollection.delete(id);
};

export const deleteAllTasksDoneToday = async () => {
  await db.tasksDoneTodayCollection.clear();
};

export const checkAndCleanupDoneTodayCollection = async () => {
  const tasks = await getAllTasksDoneToday();

  if (tasks.length === 0) {
    return;
  }

  const firstTaskScheduledStart = new Date(tasks[0].scheduledStart);
  const today = new Date();
  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  if (!isSameDay(firstTaskScheduledStart, today)) {
    await deleteAllTasksDoneToday();
  }
};
