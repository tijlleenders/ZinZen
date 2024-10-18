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
