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
  const oneDay = 24 * 60 * 60 * 1000; // One day in milliseconds
  const oneWeek = 7 * oneDay; // One week in milliseconds
  const lastCalled = new Date(hintItem.lastCheckedDate);

  const nextCallDelay = hintItem.hintFrequency === "daily" ? oneDay : oneWeek;
  let shouldCall = false;

  if (now.getTime() - lastCalled.getTime() >= nextCallDelay) {
    shouldCall = true;
  }

  if (shouldCall) {
    const goal = await getGoal(goalId);
    if (!goal) {
      return;
    }
    const newHints: IGoalHint[] = await getHintsFromAPI(goal);
    const hasNewHints = await checkForNewGoalHints(goalId, newHints);
    console.log(`Hints API called for goal ${goalId}. New hints: ${newHints.map((hint) => hint.title)}`);

    await db.hintsCollection.update(goalId, {
      lastCheckedDate: now,
      hintFrequency: hasNewHints ? "daily" : "weekly",
    });

    console.log(`Hints API called for goal ${goalId}. New hints: ${hasNewHints}`);
  } else {
    console.log(`No need to call the Hints API for goal ${goalId} yet.`);
  }
};

export const scheduledHintCalls = async () => {
  const goals = await db.hintsCollection.toArray();
  await Promise.all(goals.map((goal) => manageHintCalls(goal.id)));
};
