import { GoalItem } from "@src/models/GoalItem";

export const createSharedGoalObject = (goal: GoalItem): Omit<GoalItem, "impossible"> => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { impossible, ...goalForSharing } = goal;
  return goalForSharing;
};

export type SharedGoalItem = Omit<GoalItem, "impossible">;
