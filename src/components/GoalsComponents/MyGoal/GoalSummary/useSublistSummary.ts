import { useEffect, useState } from "react";
import { getChildrenGoals, getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

export const useSublistSummary = ({ goal }: { goal: GoalItem }) => {
  const [subGoalsCount, setSubGoalsCount] = useState(0);
  const [subBudgetsCount, setSubBudgetsCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const classifyChildren = async () => {
      try {
        const childrenGoalIds = await getChildrenGoals(goal.id);
        const childrenGoals = await Promise.all(childrenGoalIds.map((goalItem) => getGoal(goalItem.id)));

        let goalsCount = 0;
        let budgetsCount = 0;

        childrenGoals.forEach((childGoal) => {
          if (childGoal) {
            if (childGoal.timeBudget && childGoal.timeBudget.perDay !== null) {
              budgetsCount += 1;
            } else {
              goalsCount += 1;
            }
          }
        });

        if (isMounted) {
          setSubGoalsCount(goalsCount);
          setSubBudgetsCount(budgetsCount);
        }
      } catch (error) {
        if (isMounted) {
          console.error("Error fetching children goals:", error);
        }
      }
    };

    classifyChildren();

    return () => {
      isMounted = false;
    };
  }, []);

  return { subGoalsCount, subBudgetsCount };
};
