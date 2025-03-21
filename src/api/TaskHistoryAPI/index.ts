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

const createTaskEventHandler = (eventType: TaskHistoryEventTypes) => (task: ITask) =>
  addTaskHistoryItemToDB(createTaskHistoryEvent(task, eventType));

export const addTaskCompletedEvent = createTaskEventHandler(TaskHistoryEventTypes.COMPLETED);
export const addTaskPostponedEvent = createTaskEventHandler(TaskHistoryEventTypes.POSTPONED);
export const addTaskSkippedEvent = createTaskEventHandler(TaskHistoryEventTypes.SKIPPED);

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

export const getTotalDurationCompletedForGoal = async (goalId: string) => {
  const tasks = await getAllTasksHistoryCompletedEventsForGoal(goalId);
  return tasks.reduce((acc, task) => acc + task.duration, 0);
};

const getTasksSinceMonday = (tasks: TaskHistoryItem[]) => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
  monday.setHours(0, 0, 0, 0);

  return tasks
    .filter((task) => new Date(task.scheduledStart) >= monday)
    .map((task) => ({
      scheduledStartDateTime: task.scheduledStart,
      duration: task.duration,
    }));
};

export const getTasksCompletedSinceMondayForGoal = async (goalId: string) => {
  const completedTasks = await getAllTasksHistoryCompletedEventsForGoal(goalId);
  return getTasksSinceMonday(completedTasks);
};

export const getTasksSkippedSinceMondayForGoal = async (goalId: string) => {
  const skippedTasks = await getAllTasksHistorySkippedEventsForGoal(goalId);
  return getTasksSinceMonday(skippedTasks);
};
