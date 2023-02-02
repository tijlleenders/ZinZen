// @ts-nocheck
import { IDisplayChangesModal } from "@src/Interfaces/IDisplayChangesModal";
import { ITags } from "@src/Interfaces/ITagExtractor";
import { GoalItem } from "@src/models/GoalItem";
import { atom, selector } from "recoil";

export interface ISubGoalHistory {
  goalID: string,
  goalColor: string,
  goalTitle: string,
}

export const displayChangesModal = atom({
  key: "displayChangesModal",
  default: null as IDisplayChangesModal | null
});

export const displayShareModal = atom(({
  key: "displayShareModal",
  default: ""
}));

export const displaySuggestionsModal = atom({
  key: "displaySuggestionsModal",
  default: { goals: [], selected: "" } as { goals: GoalItem[], selected: string }
});

export const displayAddGoalOptions = atom({
  key: "displayAddGoalOptions",
  default: false as boolean
});

export const inputGoalTags = atom({
  key: "inputGoalTags",
  default: {} as ITags
});

export const extractedTitle = atom({
  key: "extractedTitle",
  default: "" as string
});

export const selectedColorIndex = atom({
  key: "selectedColorIndex",
  default: 0 as number
});

export const displayGoalId = atom({
  key: "displayGoalId",
  default: "root"
});
export const displayAddGoal = atom({
  key: "displayAddGoal",
  default: null as {open: boolean, goalId: string} | null
});
export const displayUpdateGoal = atom({
  key: "displayUpdateGoal",
  default: null as {open: boolean, goalId: string} | null
});
export const goalsHistory = atom({
  key: "goalsHistory",
  default: [] as ISubGoalHistory[],
});

export const addInGoalsHistory = selector({
  key: "addGoalInGoalsHistory",
  get: ({ get }) => get(goalsHistory),
  set: ({ get, set }, goal) => {
    set(goalsHistory, [...get(goalsHistory), ({
      goalID: goal.id || "root",
      goalColor: goal.goalColor || "#ffffff",
      goalTitle: goal.title || "",
    })]);
    set(displayGoalId, goal.id || "root");
  }
});

export const resetGoalsHistory = selector({
  key: "resetGoalsHistory",
  get: ({ get }) => get(goalsHistory),
  set: ({ set }) => {
    set(goalsHistory, []);
    set(displayGoalId, "root");
  }
});

export const popFromGoalsHistory = selector({
  key: "popFromGoalsHistory",
  get: ({ get }) => get(goalsHistory),
  set: ({ get, set }, index) => {
    if (get(displayAddGoal)?.open) {
      set(displayAddGoal, null);
    } else if (get(displayUpdateGoal)?.open) {
      set(displayUpdateGoal, null);
    } else {
      const currentState = get(goalsHistory).slice(0, index === -1 ? -1 : index + 1);
      if (currentState.length === 0) {
        set(displayGoalId, "root");
        set(displayAddGoal, null);
        set(displayUpdateGoal, null);
      } else {
        const item = currentState.slice(-1)[0];
        set(displayGoalId, item.goalID);
      }
      set(goalsHistory, [...currentState]);
    }
  }
});
