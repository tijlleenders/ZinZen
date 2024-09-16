import { db } from "@src/models";
import { HintItem, IGoalHint } from "@src/models/HintItem";
import { v4 as uuidv4 } from "uuid";

export const checkForNewGoalHints = async (hintId: string, newGoalHints: IGoalHint[]) => {
  try {
    const hintItem = await db.hintsCollection.get(hintId);
    if (!hintItem) return false;
    const currentGoalHints = hintItem.availableGoalHints || [];
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

export const getGoalHintItem = async (goalId: string) => {
  const hintItem = await db.hintsCollection.where("id").equals(goalId).toArray();
  return hintItem.length > 0 ? hintItem[0] : null;
};

export const addHintItem = async (goalId: string, hintOption: boolean, availableGoalHints: IGoalHint[]) => {
  const updatedAvailableGoalHintsWithId = ensureGoalHintsHaveIds(availableGoalHints);
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const hintObject: HintItem = {
    id: goalId,
    hintOptionEnabled: hintOption,
    availableGoalHints: updatedAvailableGoalHintsWithId,
    lastCheckedDate: now.toISOString(),
    nextCheckDate: oneDayLater.toISOString(),
  };
  await db
    .transaction("rw", db.hintsCollection, async () => {
      await db.hintsCollection.add(hintObject);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const updateHintItem = async (goalId: string, hint: boolean, availableGoalHints: IGoalHint[]) => {
  const updatedAvailableGoalHintsWithId = ensureGoalHintsHaveIds(availableGoalHints);
  const isNewHintPresent = await checkForNewGoalHints(goalId, updatedAvailableGoalHintsWithId);

  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  const now = new Date();
  const nextCheckDate = new Date(now.getTime() + (isNewHintPresent ? oneDay : oneWeek));

  await db
    .transaction("rw", db.hintsCollection, async () => {
      const existingItem = await db.hintsCollection.where("id").equals(goalId).first();

      if (existingItem) {
        const filteredAvailableGoalHintsWithId = updatedAvailableGoalHintsWithId.filter(
          (availableGoalHint) =>
            !existingItem.deletedGoalHints ||
            !existingItem.deletedGoalHints.some((deletedHint) => deletedHint.title === availableGoalHint.title),
        );

        await db.hintsCollection.update(goalId, {
          hint,
          goalHints: filteredAvailableGoalHintsWithId,
          lastCheckedDate: now.toISOString(),
          nextCheckDate: nextCheckDate.toISOString(),
        });
      } else {
        const newGoalHints = availableGoalHints.map((hint) => ({
          ...hint,
          id: hint.id || uuidv4(),
        }));
        await addHintItem(goalId, hint, newGoalHints);
      }
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const deleteHintItem = async (goalId: string) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      await db.hintsCollection.delete(goalId);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const deleteAvailableGoalHint = async (parentGoalId: string, goalId: string) => {
  try {
    await db.transaction("rw", db.hintsCollection, async () => {
      const goalHintsItem = await db.hintsCollection.get(parentGoalId);

      if (goalHintsItem) {
        const { availableGoalHints } = goalHintsItem;

        // Find and remove the goal hint in a single step
        const updatedGoalHints = [];
        let deletedGoalHint = null;

        for (const hint of availableGoalHints) {
          if (hint.id === goalId) {
            deletedGoalHint = hint;
          } else {
            updatedGoalHints.push(hint);
          }
        }

        const updatedDeletedGoalHints = goalHintsItem.deletedGoalHints ? [...goalHintsItem.deletedGoalHints] : [];

        // If we found the goal hint, remove the id and add it to deletedGoalHints
        if (deletedGoalHint) {
          const { id, ...deletedHintDetails } = deletedGoalHint; // Omitting 'id'
          updatedDeletedGoalHints.push(deletedHintDetails);
        }

        await db.hintsCollection.update(parentGoalId, {
          availableGoalHints: updatedGoalHints,
          deletedGoalHints: updatedDeletedGoalHints,
        });
      }
    });
  } catch (e) {
    console.error("Failed to delete available goal hint:", e);
  }
};
