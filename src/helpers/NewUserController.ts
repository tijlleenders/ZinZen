import { starterGoals, addStarterGoal } from "@src/constants/starterGoals";
import { t } from "i18next";

export const createDummyGoals = async () => {
  starterGoals.forEach(async (goal, index) => {
    addStarterGoal(t(goal.title), goal.goalTags, index)
      .catch((error) => { console.log(error, goal); });
  });
};
