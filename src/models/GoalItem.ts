export interface GoalItem {
  id?: number;
  title: string;
  duration?: number | null;
  sublist?: number[];
  repeat?: string | null;
  start: Date | null;
  due: Date | null;
  afterTime: number | null;
  beforeTime: number | null;
  createdAt?: Date;
  status: 0 | 1; // 0 = active, 1 = archived
  parentGoalId: number | -1; // -1 = no parent
  goalColor?: string;
  language: string;
  link: string | null;
}
