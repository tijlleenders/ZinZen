import { getAllGoals } from "@src/api/GoalsAPI";
import { starterGoals, addStarterGoal } from "@src/constants/starterGoals";
import { GoalItem } from "@src/models/GoalItem";
import { t } from "i18next";

export const createDefaultGoals = async () => {
  const activeGoals: GoalItem[] = await getAllGoals();
  if (activeGoals.length !== 0) {
    return;
  }
  starterGoals.forEach(async (goal) => {
    addStarterGoal(t(goal.title), goal.goalTags).catch((error) => {
      console.log(error, goal);
    });
  });
};
