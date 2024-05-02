import { db } from "@src/models";
import { IGoalHint } from "@src/models/HintItem";
import { checkForNewGoalHints, getGoalHintItem } from ".";
import { getGoal, getHintsFromAPI } from "../GoalsAPI";

const manageHintCalls = async (goalId: string) => {
  const hintItem = await getGoalHintItem(goalId);
  if (!hintItem) {
    console.error("No hint item found for the provided ID.");
    return;
  }

  const now = new Date();
  const nextCheck = new Date(hintItem.nextCheckDate);

  if (now >= nextCheck) {
    const goal = await getGoal(goalId);
    if (!goal) {
      console.log(`Goal not found for ID: ${goalId}`);
      return;
    }
    const newHints: IGoalHint[] = await getHintsFromAPI(goal);
    const hasNewHints = await checkForNewGoalHints(goalId, newHints);
    console.log(`New hints found: ${hasNewHints}`);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const nextCheckDate = new Date(now.getTime() + (hasNewHints ? oneDay : oneWeek));

    await db.hintsCollection.update(goalId, {
      lastCheckedDate: now.toISOString(),
      nextCheckDate: nextCheckDate.toISOString(),
      goalHints: newHints,
    });

    console.log(`Hints API called for goal ${goalId}. New hints: ${hasNewHints ? "found" : "not found"}`);
  }
};

export const scheduledHintCalls = async () => {
  const now = new Date().toISOString();
  const goalsDueForCheck = await db.hintsCollection.where("nextCheckDate").belowOrEqual(now).toArray();

  await Promise.all(goalsDueForCheck.map((goal) => manageHintCalls(goal.id)));
};
