import { db } from "@src/models";
import { TasksDoneTodayItem } from "@src/models/TasksDoneTodayItem";

export const addTaskDoneToday = async (completedTask: TasksDoneTodayItem) => {
  await db.tasksDoneTodayCollection.add(completedTask);
};

export const getAllTasksDoneToday = async () => {
  const tasks = await db.tasksDoneTodayCollection.toArray();
  return tasks;
};

export const deleteTaskDoneToday = async (id: string) => {
  await db.tasksDoneTodayCollection.delete(id);
};

export const deleteTasksDoneTodayByGoalId = async (goalId: string) => {
  await db.tasksDoneTodayCollection.where("goalId").equals(goalId).delete();
};

export const deleteAllTasksDoneToday = async () => {
  await db.tasksDoneTodayCollection.clear();
};
