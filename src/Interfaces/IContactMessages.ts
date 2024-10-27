import { GoalItem } from "@src/models/GoalItem";

export interface SharedGoalMessage {
  relId: string;
  goalWithChildrens: GoalItem[];
  lastProcessedTimestamp: string;
  type: "shareMessage";
  installId: string;
  TTL: number;
}

export interface SharedGoalMessageResponse {
  success: boolean;
  response: SharedGoalMessage[];
}
