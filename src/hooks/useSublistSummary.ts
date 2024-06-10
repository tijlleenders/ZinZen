import { useEffect, useState } from "react";
import { getChildrenGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { lastAction } from "@src/store";
import { useRecoilValue } from "recoil";

const classifyChildrenGoalItems = (childrenGoals: GoalItem[]) => {
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

  return { goalsCount, budgetsCount };
};

export const useSublistSummary = ({ goal }: { goal: GoalItem }) => {
  const [subGoalsCount, setSubGoalsCount] = useState(0);
  const [subBudgetsCount, setSubBudgetsCount] = useState(0);

  const action = useRecoilValue(lastAction);

  useEffect(() => {
    let isMounted = true;

    const updateSublistSummary = async () => {
      try {
        const childrenGoals = await getChildrenGoals(goal.id);
        const { goalsCount, budgetsCount } = classifyChildrenGoalItems(childrenGoals);

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

    updateSublistSummary();

    return () => {
      isMounted = false;
    };
  }, [goal, action]);

  return { subGoalsCount, subBudgetsCount };
};
