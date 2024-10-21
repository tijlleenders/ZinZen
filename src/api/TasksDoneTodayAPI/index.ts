import { db } from "@src/models";
import { TasksDoneTodayItem } from "@src/models/TasksDoneTodayItem";

export const addTaskDoneToday = async (completedTask: TasksDoneTodayItem) => {
  try {
    await db.tasksDoneTodayCollection.add(completedTask);
  } catch (error) {
    console.error("Error adding task:", error);
  }
};

export const getAllTasksDoneToday = async () => {
  try {
    const tasks = await db.tasksDoneTodayCollection.toArray();
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
};

export const deleteTaskDoneToday = async (id: string) => {
  try {
    await db.tasksDoneTodayCollection.delete(id);
  } catch (error) {
    console.error("Error deleting task:", error);
  }
};

export const deleteTasksDoneTodayByGoalId = async (goalId: string) => {
  try {
    await db.tasksDoneTodayCollection.where("goalId").equals(goalId).delete();
  } catch (error) {
    console.error("Error deleting tasks by goalId:", error);
  }
};

export const deleteAllTasksDoneToday = async () => {
  try {
    await db.tasksDoneTodayCollection.clear();
  } catch (error) {
    console.error("Error clearing tasks:", error);
  }
};
