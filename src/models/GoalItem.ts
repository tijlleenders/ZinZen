export interface GoalItem {
  id?: number;
  title: string;
  duration?: number | null;
  sublist?: number[];
  repeat?: "Once" | "Daily" | null;
  start: Date | null;
  finish: Date | null;
  createdAt?: Date;
  status: 0 | 1; // 0 = active, 1 = archived
  parentGoalId: number | -1; // -1 = no parent
  goalColor?: string;
}
