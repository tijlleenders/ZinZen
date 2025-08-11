import { db } from "@src/models";
import { IGoalHint } from "@src/models/HintItem";
import { checkForNewGoalHints, filterDeletedHints } from ".";
import { getGoal, getHintsFromAPI, updateGoal } from "../GoalsAPI";

const manageHintCalls = async (goalId: string) => {
  const goal = await getGoal(goalId);
  if (!goal) {
    console.log(`Goal not found for ID: ${goalId}`);
    return;
  }
  const { hints } = goal;
  if (!hints) {
    console.log(`No hints found for goal: ${goalId}`);
    return;
  }
  const { hintOptionEnabled, availableGoalHints, nextCheckDate: hintNextCheckDate } = hints;

  if (!hintOptionEnabled) {
    console.log(`Hint option not enabled for goal: ${goalId}`);
    return;
  }

  const now = new Date();
  const nextCheck = new Date(hintNextCheckDate!);

  if (now >= nextCheck) {
    const newHints: IGoalHint[] = await getHintsFromAPI(goal);
    const hasNewHints = await checkForNewGoalHints(availableGoalHints!, newHints);

    const oneDay = 24 * 60 * 60 * 1000;
    const oneWeek = 7 * oneDay;
    const nextCheckDate = new Date(now.getTime() + (hasNewHints ? oneDay : oneWeek));

    const filteredNewHints = filterDeletedHints(newHints, hints.deletedGoalHints);

    await updateGoal(goalId, {
      hints: {
        ...hints,
        lastCheckedDate: now.toISOString(),
        nextCheckDate: nextCheckDate.toISOString(),
        availableGoalHints: filteredNewHints,
      },
    });

    console.log(`Hints API called for goal ${goalId}. New hints: ${hasNewHints ? "found" : "not found"}`);
  }
};

export const scheduledHintCalls = async () => {
  const now = new Date().toISOString();
  const goalsDueForCheck = await db.goalsCollection.where("hints.nextCheckDate").belowOrEqual(now).toArray();

  await Promise.all(goalsDueForCheck.map((goal) => manageHintCalls(goal.id)));
};
