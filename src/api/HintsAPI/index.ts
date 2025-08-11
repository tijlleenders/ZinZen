import { db } from "@src/models";
import { IGoalHint } from "@src/models/HintItem";
import { v4 as uuidv4 } from "uuid";

export const filterDeletedHints = (availableHints: IGoalHint[], deletedHints?: IGoalHint[]): IGoalHint[] => {
  if (!deletedHints) return availableHints;
  return availableHints.filter(
    (hint) =>
      !deletedHints.some((deletedHint) => deletedHint.title.toLowerCase().trim() === hint.title.toLowerCase().trim()),
  );
};

export const checkForNewGoalHints = async (
  currentGoalHints: IGoalHint[],
  newGoalHints: IGoalHint[],
): Promise<boolean> => {
  try {
    const existingTitles = new Set(currentGoalHints.map((hint) => hint.title));
    return newGoalHints.some((newHint) => !existingTitles.has(newHint.title));
  } catch (error) {
    console.error("Error checking for new goal hints:", error);
    return false;
  }
};
export const ensureGoalHintsHaveIds = (goalHints: IGoalHint[]): IGoalHint[] => {
  return goalHints.map((hintItem) => {
    if (!hintItem.id) {
      return { ...hintItem, id: uuidv4() };
    }
    return hintItem;
  });
};

export const deleteAvailableGoalHint = async (parentGoalId: string, hintId: string): Promise<boolean> => {
  try {
    // Get the goal with proper error handling
    const goal = await db.goalsCollection.get(parentGoalId);
    if (!goal) {
      console.error(`Goal with id ${parentGoalId} not found`);
      return false;
    }

    const { hints } = goal;
    if (!hints) {
      console.error(`No hints found for goal ${parentGoalId}`);
      return false;
    }

    const { availableGoalHints, deletedGoalHints = [] } = hints;
    if (!availableGoalHints || availableGoalHints.length === 0) {
      console.error(`No available goal hints found for goal ${parentGoalId}`);
      return false;
    }

    const deletedGoalHint = availableGoalHints.find((hint) => hint.id === hintId);
    if (!deletedGoalHint) {
      console.error(`Hint with id ${hintId} not found in available hints`);
      return false;
    }

    const updatedGoalHints = availableGoalHints.filter((hint) => hint.id !== hintId);
    const updatedDeletedGoalHints = [...deletedGoalHints, deletedGoalHint];

    // Use transaction for data consistency
    await db.transaction("rw", db.goalsCollection, async () => {
      await db.goalsCollection.update(parentGoalId, {
        hints: {
          ...hints, // Preserve other hint properties
          availableGoalHints: updatedGoalHints,
          deletedGoalHints: updatedDeletedGoalHints,
        },
      });
    });

    console.log(`Successfully deleted hint ${hintId} from goal ${parentGoalId}`);
    return true;
  } catch (error) {
    console.error("Failed to delete available goal hint:", error);
    return false;
  }
};
