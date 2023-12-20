import { useEffect, useState } from "react";
import { getChildrenGoals, getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

export const useSublistSummary = ({ goal }: { goal: GoalItem }) => {
  const [subGoalsCount, setSubGoalsCount] = useState(0);
  const [subBudgetsCount, setSubBudgetsCount] = useState(0);

  useEffect(() => {
    const classifyChildren = async () => {
      const childrenGoalIds = await getChildrenGoals(goal.id);
      const childrenGoals = await Promise.all(childrenGoalIds.map((goalItem) => getGoal(goalItem.id)));

      let goalsCount = 0;
      let budgetsCount = 0;
      childrenGoals.forEach((childGoal) => {
        if (childGoal && !childGoal.timeBudget.perDay) {
          goalsCount += 1;
        } else if (childGoal) {
          budgetsCount += 1;
        }
      });

      setSubGoalsCount(goalsCount);
      setSubBudgetsCount(budgetsCount);
    };

    classifyChildren();
  }, [goal]);

  return { subGoalsCount, subBudgetsCount };
};
