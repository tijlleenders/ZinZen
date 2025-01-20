import { db } from "@src/models";
import { TaskHistoryEventTypes, TaskHistoryItem } from "@src/models/TaskHistoryItem";
import { ITask } from "@src/Interfaces/Task";

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

async function addTaskHistoryItemToDB(task: TaskHistoryItem) {
  try {
    await db.taskHistoryCollection.add(task);
  } catch (error) {
    console.error("Error adding task history item to DB:", error);
  }
}

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

export const getAllTasksDoneToday = async (date: string) => {
  return getTasksByEventTypeAndDate(TaskHistoryEventTypes.COMPLETED, date);
};

export const getAllTodaySkippedTasks = async (date: string) => {
  return getTasksByEventTypeAndDate(TaskHistoryEventTypes.SKIPPED, date);
};
