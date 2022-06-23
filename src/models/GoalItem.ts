export interface GoalItem {
  id?: number;
  title: string;
  duration: number;
  sublist?: GoalItem[];
  repeat: "Once" | "Daily";
  start: Date | null;
  finish: Date | null;
  createdAt?: Date;
  status: 0 | 1; // 0 = active, 1 = archived
  parentGoalId?: number;
}
