import { getChildrenGoals } from "@src/api/GoalsAPI";
import { getImpossibleGoalById } from "@src/api/ImpossibleGoalsApi";
import { useEffect, useState } from "react";

const useIsGoalImpossible = ({ id }: { id: string }) => {
  const [isImpossible, setIsImpossible] = useState(false);

  const isGoalOrChildrenImpossible = async (currentGoalId: string): Promise<boolean> => {
    const goalIsImpossible = await getImpossibleGoalById(currentGoalId);

    if (goalIsImpossible) {
      setIsImpossible(true);
      return true;
    }

    const children = await getChildrenGoals(currentGoalId);
    const childResults = await Promise.all(children.map((child) => isGoalOrChildrenImpossible(child.id)));

    if (childResults.some((result) => result)) {
      setIsImpossible(true);
      return true;
    }

    return false;
  };

  useEffect(() => {
    isGoalOrChildrenImpossible(id);
  }, [id]);

  return isImpossible;
};

export default useIsGoalImpossible;
