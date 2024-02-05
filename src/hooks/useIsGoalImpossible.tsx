import { getImpossibleGoalById } from "@src/api/ImpossibleGoalsApi";
import { useEffect, useState } from "react";

const useIsGoalImpossible = ({ id }: { id: string }) => {
  const [isImpossible, setIsImpossible] = useState(false);

  useEffect(() => {
    const isGoalImpossible = async (goalId: string) => {
      const res = await getImpossibleGoalById(goalId);
      if (res) {
        setIsImpossible(true);
      } else {
        setIsImpossible(false);
      }
    };

    isGoalImpossible(id);
  }, [id]);

  return isImpossible;
};

export default useIsGoalImpossible;
