import { GoalItem } from "@src/models/GoalItem";
import archiveSound from "@assets/archive.mp3";
import pageCrumplingSound from "@assets/page-crumpling-sound.mp3";
import { archiveSharedWMGoal } from "@src/api/SharedWMAPI";
import { moveToPartner, deleteSharedGoal, deleteGoal, archiveGoal } from "./GoalController";

const pageCrumple = new Audio(pageCrumplingSound);
const doneSound = new Audio(archiveSound);

export const removeThisGoal = async (
  goal: GoalItem,
  ancestors: string[],
  isInboxOpen: boolean,
  showPartnerMode: boolean,
) => {
  await pageCrumple.play();
  if (isInboxOpen) {
    await moveToPartner(goal);
  } else if (showPartnerMode) {
    await deleteSharedGoal(goal);
  } else {
    await deleteGoal(goal, ancestors);
  }
};

export const archiveThisGoal = async (goal: GoalItem, ancestors: string[], isInboxOpen: boolean) => {
  await doneSound.play();
  if (isInboxOpen) {
    await archiveSharedWMGoal(goal);
  } else await archiveGoal(goal, ancestors);
};
