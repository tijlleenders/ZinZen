export type TaskHistoryEvents = "completed" | "postponed" | "skipped";

export interface TaskHistoryItem {
  goalId: string;
  eventType: TaskHistoryEvents;
  scheduledStart: string;
  scheduledEnd: string;
  eventTime: string;
  duration: number;
}
