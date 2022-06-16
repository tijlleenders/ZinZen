export enum Repeat {
  "Once",
  "Daily",
}

export interface GoalItem {
  id?: number;
  title: string;
  duration: Number;
  sublist: string[] | null;
  repeat: Repeat | string;
  start: Date | null;
  finish: Date | null;
  createdAt: Date;
}
