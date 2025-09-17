import { GoalItem } from "@src/models/GoalItem";
import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";

export const useSublistSummary = ({ goal }: { goal: GoalItem }) => {
  const { activeGoals } = useGetActiveGoals(goal.id);

  const childrenGoals = activeGoals || [];

  const subGoalsCount = childrenGoals.filter((childGoal) => childGoal?.timeBudget === undefined).length;

  const subBudgetsCount = childrenGoals.filter((childGoal) => childGoal?.timeBudget != null).length;

  return { subGoalsCount, subBudgetsCount };
};
