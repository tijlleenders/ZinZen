import { GoalItem } from "@src/models/GoalItem";
import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";

const classifyChildrenGoalItems = (childrenGoals: GoalItem[]) => {
  let goalsCount = 0;
  let budgetsCount = 0;

  childrenGoals.forEach((childGoal) => {
    if (childGoal) {
      if (childGoal.timeBudget?.perDay !== undefined) {
        budgetsCount += 1;
      } else {
        goalsCount += 1;
      }
    }
  });

  return { goalsCount, budgetsCount };
};

export const useSublistSummary = ({ goal }: { goal: GoalItem }) => {
  const { activeGoals } = useGetActiveGoals(goal.id);

  const { goalsCount, budgetsCount } = classifyChildrenGoalItems(activeGoals || []);

  return { subGoalsCount: goalsCount, subBudgetsCount: budgetsCount };
};
