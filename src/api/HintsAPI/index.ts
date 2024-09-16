import { db } from "@src/models";
import { HintItem, IGoalHint } from "@src/models/HintItem";
import { v4 as uuidv4 } from "uuid";

export const checkForNewGoalHints = async (hintId: string, newGoalHints: IGoalHint[]): Promise<boolean> => {
  try {
    const hintItem = await db.hintsCollection.get(hintId);
    if (!hintItem) return false;
    const existingTitles = new Set(hintItem.availableGoalHints?.map((hint) => hint.title) || []);
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
  const hintItem = await db.hintsCollection.where("id").equals(goalId).first();
  return hintItem;
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

export const updateHintItem = async (goalId: string, hintOptionEnabled: boolean, availableGoalHints: IGoalHint[]) => {
  try {
    const updatedGoalHintsWithId = ensureGoalHintsHaveIds(availableGoalHints);
    const hasNewHints = await checkForNewGoalHints(goalId, updatedGoalHintsWithId);

    const now = new Date();
    const nextCheckDate = new Date(
      now.getTime() + (hasNewHints ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000),
    ).toISOString();

    await db.transaction("rw", db.hintsCollection, async () => {
      const existingItem = await db.hintsCollection.where("id").equals(goalId).first();

      if (existingItem) {
        const filteredGoalHints = updatedGoalHintsWithId.filter(
          (hint) =>
            !existingItem.deletedGoalHints ||
            !existingItem.deletedGoalHints.some((deletedHint) => deletedHint.title === hint.title),
        );

        await db.hintsCollection.update(goalId, {
          hintOptionEnabled,
          availableGoalHints: filteredGoalHints,
          lastCheckedDate: now.toISOString(),
          nextCheckDate,
        });
      } else {
        const newGoalHints = updatedGoalHintsWithId.map((hint) => ({
          ...hint,
          id: hint.id || uuidv4(),
        }));
        await addHintItem(goalId, hintOptionEnabled, newGoalHints);
      }
    });
  } catch (error) {
    console.error("Failed to update hint item:", error);
  }
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

        if (deletedGoalHint) {
          const { id, ...deletedHintDetails } = deletedGoalHint;
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
