// eslint-disable-next-line no-shadow
export enum TaskHistoryEventTypes {
  COMPLETED = "completed",
  POSTPONED = "postponed",
  SKIPPED = "skipped",
}

export interface TaskHistoryItem {
  goalId: string;
  eventType: TaskHistoryEventTypes;
  scheduledStart: string;
  scheduledEnd: string;
  eventTime: string;
  duration: number;
}
