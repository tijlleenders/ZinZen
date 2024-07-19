// @ts-nocheck
import { atom } from "recoil";
import { GoalItem } from "@src/models/GoalItem";

export interface ISubGoalHistory {
  goalID: string;
  goalColor: string;
  goalTitle: string;
}

export type TAction = "deleted" | "archived" | "regular" | "hints";
export type TDisplayGoalActions = { actionType: TAction; goal: GoalItem };

export const displayGoalActions = atom({
  key: "displayGoalActions",
  default: null as TDisplayGoalActions | null,
});

export const displayGoalConfigModal = atom({
  key: "displayGoalConfigModal",
  default: null as { open: boolean; goalId: string } | null,
});

export const displayChangesModal = atom({
  key: "displayChangesModal",
  default: null as GoalItem | null,
});

export const displayAddContact = atom({
  key: "displayAddContact",
  default: false,
});

export const displayShareModal = atom({
  key: "displayShareModal",
  default: null as GoalItem | null,
});

export const displayParticipants = atom({
  key: "displayParticipants",
  default: null as string | null,
});

export const displaySuggestionsModal = atom({
  key: "displaySuggestionsModal",
  default: { goals: [], selected: "" } as { goals: GoalItem[]; selected: string },
});

export const extractedTitle = atom({
  key: "extractedTitle",
  default: "" as string,
});

export const selectedColorIndex = atom({
  key: "selectedColorIndex",
  default: 0 as number,
});

export const displayGoalId = atom({
  key: "displayGoalId",
  default: "root",
});

export const displayAddGoal = atom({
  key: "displayAddGoal",
  default: null as { open: boolean; goalId: string } | null,
});

export const displayUpdateGoal = atom({
  key: "displayUpdateGoal",
  default: null as { open: boolean; goalId: string } | null,
});

export const goalsHistory = atom({
  key: "goalsHistory",
  default: [] as ISubGoalHistory[],
});

export const allowAddingBudgetGoal = atom({
  key: "allowAddingBudgetGoal",
  default: true,
});
