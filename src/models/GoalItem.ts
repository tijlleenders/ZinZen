import { ICollaboration } from "@src/Interfaces/ICollaboration";
import { IShared } from "@src/Interfaces/IShared";

export interface GoalItem {
  id: string;
  title: string;
  duration?: number | null;
  sublist: string[];
  repeat?: string | null;
  start: Date | null;
  due: Date | null;
  afterTime: number | null;
  beforeTime: number | null;
  createdAt?: Date;
  archived: "false" | "true";
  parentGoalId: string; // -1 = no parent
  goalColor: string;
  language: string;
  link: string | null;
  collaboration: ICollaboration;
  shared: IShared | null
}
