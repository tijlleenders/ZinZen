import { GoalItem } from "@src/models/GoalItem";
import archiveSound from "@assets/archive.mp3";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";
import { deleteSharedGoal, archiveGoal, softDeleteGoal, deleteGoal } from "./GoalController";

const pageCrumple = new Audio(pageCrumplingSound);
const doneSound = new Audio(archiveSound);

export const removeThisGoal = async (
  goal: GoalItem,
  ancestors: string[],
  showPartnerMode: boolean,
  isGoalSoftDeleted: boolean,
) => {
  await pageCrumple.play();
  if (showPartnerMode) {
    await deleteSharedGoal(goal);
  } else if (isGoalSoftDeleted) {
    await deleteGoal(goal, ancestors);
  } else {
    await softDeleteGoal(goal, ancestors);
  }
};

export const archiveThisGoal = async (goal: GoalItem, ancestors: string[]) => {
  console.log("1. Starting archiveThisGoal");
  await doneSound.play();
  await archiveGoal(goal, ancestors);
};
