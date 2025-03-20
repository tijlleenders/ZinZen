import { ILevelGoals } from "@src/api/GoalsAPI";

export interface SharedGoalMessage {
  relId: string;
  levelGoalsNode: ILevelGoals[];
  lastProcessedTimestamp: string;
  type: "shareMessage";
  installId: string;
  TTL: number;
}

export interface SharedGoalMessageResponse {
  success: boolean;
  response: SharedGoalMessage[];
}
