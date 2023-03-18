import { ICollaboration } from "@src/Interfaces/ICollaboration";
import { IShared } from "@src/Interfaces/IShared";

export interface GoalItem {
  id: string,
  title: string,
  duration: string | null,
  sublist: string[],
  habit: string | null,
  on: "weekends" | "weekdays" | null,
  due: Date | null,
  start: Date | null,
  beforeTime: number | null,
  afterTime: number | null,
  createdAt: Date,
  archived: "false" | "true",
  parentGoalId: string,
  goalColor: string,
  language: string,
  link: string | null,
  collaboration: ICollaboration,
  shared: IShared,
  rootGoalId: string,
  timeBudget: { duration: string, period: "week" | "day" } | null,
  typeOfGoal: "myGoal" | "shared" | "collaboration",
}
