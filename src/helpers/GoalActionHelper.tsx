import { GoalItem } from "@src/models/GoalItem";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";
import { deleteSharedGoal, deleteGoal, archiveGoal } from "./GoalController";

const pageCrumple = new Audio(pageCrumplingSound);

export const removeThisGoal = async (goal: GoalItem, ancestors: string[], showPartnerMode: boolean) => {
  await pageCrumple.play();
  if (showPartnerMode) {
    await deleteSharedGoal(goal);
  } else {
    await deleteGoal(goal, ancestors);
  }
};

export const archiveThisGoal = async (goal: GoalItem, ancestors: string[]) => {
  await archiveGoal(goal, ancestors);
};
