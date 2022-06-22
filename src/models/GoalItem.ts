export enum Repeat {
  "Once",
  "Daily",
}

export interface GoalItem {
  id?: Number;
  title: string;
  duration: Number;
  sublist?: GoalItem[];
  repeat: Repeat | string;
  start: Date | null;
  finish: Date | null;
  createdAt?: Date;
  status: 0 | 1; // 0 = active, 1 = archived
  parentGoalId?: Number;
}
