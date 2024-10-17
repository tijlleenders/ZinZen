import { db } from "@src/models";
import { TaskHistoryEvents, TaskHistoryItem } from "@src/models/TaskHistoryItem";
import { ITask } from "@src/Interfaces/Task";

import { v4 as uuidv4 } from "uuid";

export async function addTaskActionEvent(task: ITask, eventType: TaskHistoryEvents) {
  if (!task) return;

  const newEvent: TaskHistoryItem = {
    id: uuidv4(),
    goalId: task.goalid,
    eventType,
    duration: task.duration,
    scheduledStart: task.start,
    scheduledEnd: task.deadline,
    eventTime: new Date().toLocaleDateString(),
  };

  await db.taskHistoryCollection.add(newEvent);
}
