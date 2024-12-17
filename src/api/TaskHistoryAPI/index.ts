import { db } from "@src/models";
import { TaskHistoryEvents, TaskHistoryItem } from "@src/models/TaskHistoryItem";
import { ITask } from "@src/Interfaces/Task";

export async function addTaskActionEvent(task: ITask, eventType: TaskHistoryEvents) {
  if (!task) return;

  const newEvent: TaskHistoryItem = {
    goalId: task.goalid,
    eventType,
    duration: task.duration,
    scheduledStart: task.start,
    scheduledEnd: task.deadline,
    eventTime: new Date().toISOString(),
  };

  await db.taskHistoryCollection.add(newEvent);
}

export async function deleteTaskHistoryItem(goalId: string) {
  await db.taskHistoryCollection.where("goalId").equals(goalId).delete();
}
