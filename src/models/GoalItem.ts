import { ICollaboration } from "@src/Interfaces/ICollaboration";
import { IShared } from "@src/Interfaces/IShared";

export interface GoalItem {
  id: string;
  title: string;
  duration: string | null;
  sublist: string[];
  habit: string | null;
  on: string[];
  due: string | null;
  start: string | null;
  beforeTime: number | null;
  afterTime: number | null;
  createdAt: string;
  archived: "false" | "true";
  parentGoalId: string;
  goalColor: string;
  language: string;
  link: string | null;
  collaboration: ICollaboration;
  shared: IShared;
  rootGoalId: string;
  timeBudget: {
    perDay: string | null;
    perWeek: string | null;
  };
  typeOfGoal: "myGoal" | "shared" | "collaboration";
}
