import { db } from "@src/models";
import { IGoalHint } from "@src/models/HintItem";
import { v4 as uuidv4 } from "uuid";

export const getGoalHintItem = async (goalId: string) => {
  const hintItem = await db.hintsCollection.where("id").equals(goalId).toArray();
  return hintItem.length > 0 ? hintItem[0] : null;
};

export const addHintItem = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
  const updatedHintsWithId = goalHints.map((hintItem: IGoalHint) => {
    if (!hintItem.id) {
      return { ...hintItem, id: uuidv4() };
    }
    return hintItem;
  });
  const hintObject = { id: goalId, hint, goalHints: updatedHintsWithId };
  await db
    .transaction("rw", db.hintsCollection, async () => {
      await db.hintsCollection.add(hintObject);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};

export const updateHintItem = async (goalId: string, hint: boolean, goalHints: IGoalHint[]) => {
  await db
    .transaction("rw", db.hintsCollection, async () => {
      const existingItem = await db.hintsCollection.where("id").equals(goalId).first();

      if (existingItem) {
        const updatedHintsWithId = goalHints.map((hintItem: IGoalHint) => {
          if (!hintItem.id) {
            return { ...hintItem, id: uuidv4() };
          }
          return hintItem;
        });

        const filteredHintsWithId = updatedHintsWithId.filter(
          (hintItem) =>
            !existingItem.deletedGoalHints ||
            !existingItem.deletedGoalHints.some((deletedHint) => deletedHint.title === hintItem.title),
        );

        await db.hintsCollection.update(goalId, {
          hint,
          goalHints: filteredHintsWithId,
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
        const updatedGoalHints = goalHintsItem.goalHints.filter((hint) => hint.id !== goalId);
        const deletedGoalHint = goalHintsItem.goalHints.find((hint) => hint.id === goalId);

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
