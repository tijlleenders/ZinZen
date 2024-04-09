import { GoalItem } from "./GoalItem";

export interface TrashItem extends GoalItem {
  deletedAt: string;
}
