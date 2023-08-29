import { GoalItem } from "./GoalItem";

export interface PartnerItem {
  id?: number;
  relId: string;
  name: string;
  goals: GoalItem[];
}
