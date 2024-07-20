import { db } from "@src/models";
import { HintRecord, IGoalHint } from "@src/models/HintRecord";
import { v4 as uuidv4 } from "uuid";

export const checkForNewGoalHints = async (hintId: string, newGoalHints: IGoalHint[]) => {
  try {
    const hintItem = await db.hintRecordCollection.get(hintId);
    if (!hintItem) return false;
    const currentGoalHints = hintItem.goalHints || [];
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

export const getHintRecord = async (goalId: string) => {
  const hintRecord = await db.hintRecordCollection.where("id").equals(goalId).toArray();
  return hintRecord.length > 0 ? hintRecord[0] : null;
};

export const addHintRecord = async (goalId: string): Promise<string | undefined> => {
  const now = new Date();
  const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  try {
    const newHintRecord: HintRecord = {
      id: uuidv4(),
      goalItemId: goalId,
      hintEnabled: true,
      lastCheckedDate: now.toISOString(),
      nextCheckDate: oneDayLater.toISOString(),
    };

    await db.transaction("rw", db.hintRecordCollection, async () => {
      await db.hintRecordCollection.add(newHintRecord);
    });

    return newHintRecord.id;
  } catch (e) {
    console.log(e.stack || e);
    return undefined;
  }
};

// export const addHintItem = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
//   const updatedHintsWithId = ensureGoalHintsHaveIds(goalHints);
//   const now = new Date();
//   const oneDayLater = new Date(now.getTime() + 24 * 60 * 60 * 1000);
//   const hintObject = {
//     id: goalId,
//     hint,
//     goalHints: updatedHintsWithId,
//     lastCheckedDate: now.toISOString(),
//     nextCheckDate: oneDayLater.toISOString(),
//   };
//   await db
//     .transaction("rw", db.hintRecordCollection, async () => {
//       await db.hintRecordCollection.add(hintObject);
//     })
//     .catch((e) => {
//       console.log(e.stack || e);
//     });
// };

export const updateHintItem = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
  const updatedHintsWithId = ensureGoalHintsHaveIds(goalHints);
  const isNewHintPresent = await checkForNewGoalHints(goalId, updatedHintsWithId);

  const oneDay = 24 * 60 * 60 * 1000;
  const oneWeek = 7 * oneDay;

  const now = new Date();
  const nextCheckDate = new Date(now.getTime() + (isNewHintPresent ? oneDay : oneWeek));

  await db
    .transaction("rw", db.hintRecordCollection, async () => {
      const existingItem = await db.hintRecordCollection.where("id").equals(goalId).first();

      if (existingItem) {
        const filteredHintsWithId = updatedHintsWithId.filter(
          (hintItem) =>
            !existingItem.deletedGoalHints ||
            !existingItem.deletedGoalHints.some((deletedHint) => deletedHint.title === hintItem.title),
        );

        await db.hintRecordCollection.update(goalId, {
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
    .transaction("rw", db.hintRecordCollection, async () => {
      await db.hintRecordCollection.delete(goalId);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const deleteGoalHint = async (parentGoalId: string, goalId: string) => {
  await db
    .transaction("rw", db.hintRecordCollection, async () => {
      const goalHintsItem = await db.hintRecordCollection.get(parentGoalId);

      if (goalHintsItem) {
        const updatedGoalHints = goalHintsItem.goalHints.filter((hint) => hint.id !== goalId);
        const deletedGoalHint = goalHintsItem.goalHints.find((hint) => hint.id === goalId);

        const updatedDeletedGoalHints = goalHintsItem.deletedGoalHints ? [...goalHintsItem.deletedGoalHints] : [];

        if (deletedGoalHint) {
          const deletedHintDetails: IGoalHint = { ...deletedGoalHint };
          delete deletedHintDetails.id;
          updatedDeletedGoalHints.push(deletedHintDetails);
        }

        await db.hintRecordCollection.update(parentGoalId, {
          goalHints: updatedGoalHints,
          deletedGoalHints: updatedDeletedGoalHints,
        });
      }
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
