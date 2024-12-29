import { GoalItem } from "@src/models/GoalItem";
import { typeOfIntent } from "@src/models/InboxItem";
import ContactItem from "@src/models/ContactItem";
import { ITagsChanges } from "./IDisplayChangesModal";

export type ChangeAcceptParams = {
  goalUnderReview: GoalItem;
  newGoals?: Array<{ intent: typeOfIntent; goal: GoalItem }>;
  unselectedChanges?: string[];
  updateList?: ITagsChanges;
  updatesIntent: typeOfIntent;
  participants: ContactItem[];
  activePPT: number;
};

export interface ChangeAcceptStrategy {
  execute(params: ChangeAcceptParams): Promise<void>;
}
