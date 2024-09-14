import { db } from "@src/models";
import { HintItem, IGoalHint } from "@src/models/HintItem";
import { v4 as uuidv4 } from "uuid";

export const checkForNewGoalHints = async (hintId: string, newGoalHints: IGoalHint[]) => {
  try {
    const hintItem = await db.hintsCollection.get(hintId);
    if (!hintItem) return false;
    const currentGoalHints = hintItem.availableGoalHints || [];
    const combinedHints = [...currentGoalHints];

    const existingTitles = new Set(combinedHints.map((hint) => hint.title));

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

export const addHintItem = async (goalId: string, hintOption: boolean, goalHints: IGoalHint[]) => {
  const updatedHintsWithId = ensureGoalHintsHaveIds(goalHints);
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const hintObject: HintItem = {
    id: goalId,
    hintOptionEnabled: hintOption,
    availableGoalHints: updatedHintsWithId,
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

export const updateHintItem = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
  const updatedHintsWithId = ensureGoalHintsHaveIds(goalHints);
  const isNewHintPresent = await checkForNewGoalHints(goalId, updatedHintsWithId);

  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  const now = new Date();
  const nextCheckDate = new Date(now.getTime() + (isNewHintPresent ? oneDay : oneWeek));

  await db
    .transaction("rw", db.hintsCollection, async () => {
      const existingItem = await db.hintsCollection.where("id").equals(goalId).first();

      if (existingItem) {
        const filteredHintsWithId = updatedHintsWithId.filter(
          (hintItem) =>
            !existingItem.deletedGoalHints ||
            !existingItem.deletedGoalHints.some((deletedHint) => deletedHint.title === hintItem.title),
        );

        await db.hintsCollection.update(goalId, {
          hint,
          goalHints: filteredHintsWithId,
          lastCheckedDate: now.toISOString(),
          nextCheckDate: nextCheckDate.toISOString(),
        });
      } else {
        const newHints = goalHints.map((hintItem) => ({
          ...hintItem,
          id: hintItem.id || uuidv4(),
        }));
        await addHintItem(goalId, hint, newHints);
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

export const deleteGoalHint = async (parentGoalId: string, goalId: string) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      const goalHintsItem = await db.hintsCollection.get(parentGoalId);

      if (goalHintsItem) {
        const updatedGoalHints = goalHintsItem.availableGoalHints.filter((hint) => hint.id !== goalId);
        const deletedGoalHint = goalHintsItem.availableGoalHints.find((hint) => hint.id === goalId);

        const updatedDeletedGoalHints = goalHintsItem.deletedGoalHints ? [...goalHintsItem.deletedGoalHints] : [];

        if (deletedGoalHint) {
          const deletedHintDetails: IGoalHint = { ...deletedGoalHint };
          delete deletedHintDetails.id;
          updatedDeletedGoalHints.push(deletedHintDetails);
        }

        await db.hintsCollection.update(parentGoalId, {
          goalHints: updatedGoalHints,
          deletedGoalHints: updatedDeletedGoalHints,
        });
      }
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
