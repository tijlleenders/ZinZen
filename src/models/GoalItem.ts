export interface GoalItem {
  id: string;
  title: string;
  duration?: number | null;
  sublist?: string[];
  repeat?: string | null;
  start: Date | null;
  due: Date | null;
  afterTime: number | null;
  beforeTime: number | null;
  createdAt?: Date;
  status: 0 | 1; // 0 = active, 1 = archived
  parentGoalId: string; // -1 = no parent
  goalColor: string;
  language: string;
  link: string | null;
  collaboration: string;
  shared: null |
    {
      relId: string,
      name: string
    }
}
