import { db } from "@src/models";
import { SubGoalHint } from "@src/models/SubGoalHint";
import { v4 as uuidv4 } from "uuid";
import { getGoal } from "../GoalsAPI";

export const addSubGoalHint = async (newSubGoalHint: SubGoalHint) => {
  await db
    .transaction("rw", db.subGoalHintCollection, async () => {
      await db.subGoalHintCollection.add(newSubGoalHint);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
};
