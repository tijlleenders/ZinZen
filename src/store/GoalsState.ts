// @ts-nocheck
import { atom } from "recoil";
import { GoalItem, IParticipant } from "@src/models/GoalItem";
import { IDisplayChangesModal } from "@src/Interfaces/IDisplayChangesModal";

export interface ISubGoalHistory {
  goalID: string;
  goalColor: string;
  goalTitle: string;
}

export const displayGoalActions = atom({
  key: "displayGoalActions",
  default: null as GoalItem | null,
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
