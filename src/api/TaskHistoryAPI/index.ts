import { db } from "@src/models";
import { TaskHistoryEventTypes, TaskHistoryItem } from "@src/models/TaskHistoryItem";
import { ITask } from "@src/Interfaces/Task";

async function addTaskHistoryItemToDB(task: TaskHistoryItem) {
  try {
    await db.taskHistoryCollection.add(task);
  } catch (error) {
    console.error("Error adding task history item to DB:", error);
  }
}

const createTaskHistoryEvent = (task: ITask, eventType: TaskHistoryEventTypes): TaskHistoryItem => {
  return {
    goalId: task.goalid,
    eventType,
    duration: task.duration,
    scheduledStart: task.start,
    scheduledEnd: task.deadline,
    eventTime: new Date().toISOString(),
    taskId: task.taskid,
  };
};

export async function addTaskCompletedEvent(task: ITask) {
  const event = createTaskHistoryEvent(task, TaskHistoryEventTypes.COMPLETED);
  await addTaskHistoryItemToDB(event);
}

export async function addTaskPostponedEvent(task: ITask) {
  const event = createTaskHistoryEvent(task, TaskHistoryEventTypes.POSTPONED);
  await addTaskHistoryItemToDB(event);
}

export async function addTaskSkippedEvent(task: ITask) {
  const event = createTaskHistoryEvent(task, TaskHistoryEventTypes.SKIPPED);
  await addTaskHistoryItemToDB(event);
}

export async function deleteTaskHistoryItem(goalId: string) {
  await db.taskHistoryCollection.where("goalId").equals(goalId).delete();
}

const getTasksByEventTypeAndDate = async (eventType: TaskHistoryEventTypes, date: string) => {
  try {
    const tasks = await db.taskHistoryCollection
      .where("eventType")
      .equals(eventType)
      .and((item) => item.eventTime.startsWith(date))
      .toArray();
    return tasks;
  } catch (error) {
    console.error(`Error fetching ${eventType} tasks:`, error);
    return [];
  }
};

export const getAllTasksDoneToday = async () => {
  const date = new Date().toISOString().split("T")[0];
  return getTasksByEventTypeAndDate(TaskHistoryEventTypes.COMPLETED, date);
};

export const getAllTodaySkippedTasks = async () => {
  const date = new Date().toISOString().split("T")[0];
  return getTasksByEventTypeAndDate(TaskHistoryEventTypes.SKIPPED, date);
};

export const getTimeCompletedTodayForGoal = async (goalId: string) => {
  const tasks = await getAllTasksDoneToday();
  const goalTasks = tasks.filter((task) => task.goalId === goalId);
  return goalTasks.reduce((acc, task) => acc + task.duration, 0);
};

export const getAllTaskHistoryEventsForGoal = async (goalId: string) => {
  try {
    const tasks = await db.taskHistoryCollection.where("goalId").equals(goalId).toArray();
    return tasks;
  } catch (error) {
    console.error("Error fetching task history events for goal:", error);
    return [];
  }
};

export const getAllTasksHistoryCompletedEventsForGoal = async (goalId: string) => {
  const tasks = await getAllTaskHistoryEventsForGoal(goalId);
  return tasks.filter((task) => task.eventType === TaskHistoryEventTypes.COMPLETED);
};

export const getAllTasksHistorySkippedEventsForGoal = async (goalId: string) => {
  const tasks = await getAllTaskHistoryEventsForGoal(goalId);
  return tasks.filter((task) => task.eventType === TaskHistoryEventTypes.SKIPPED);
};

export const getTotalTimeCompletedForGoal = async (goalId: string) => {
  const tasks = await getAllTasksHistoryCompletedEventsForGoal(goalId);
  return tasks.reduce((acc, task) => acc + task.duration, 0);
};

export const getTaskHistoryEventsOfLast7DaysForGoal = async (goalId: string) => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  const tasks = await getAllTaskHistoryEventsForGoal(goalId);
  return tasks.filter((task) => {
    if (task.eventTime >= sevenDaysAgo.toISOString() && task.eventTime <= today.toISOString()) {
      return task;
    }
    return false;
  });
};

export const getTimeCompletedForGoalInLast7Days = async (goalId: string) => {
  const last7DaysTasks = await getTaskHistoryEventsOfLast7DaysForGoal(goalId);
  return last7DaysTasks.reduce((acc, task) => acc + task.duration, 0);
};
