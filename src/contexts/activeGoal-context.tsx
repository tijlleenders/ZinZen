import { getGoalById } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type ActiveGoalContext = {
  goal: GoalItem | undefined;
  setGoal: React.Dispatch<React.SetStateAction<GoalItem | undefined>>;
};

export const ActiveGoalContext = createContext<ActiveGoalContext | undefined>(undefined);

export const ActiveGoalProvider = ({ children }: { children: ReactNode }) => {
  const { activeGoalId } = useParams();
  const [goal, setGoal] = useState<GoalItem>();

  useEffect(() => {
    if (activeGoalId) {
      getGoalById(activeGoalId).then((doc) => setGoal(doc));
      return;
    }
    setGoal(undefined);
  }, [activeGoalId]);

  const value = useMemo(() => ({ goal, setGoal }), [goal]);

  return <ActiveGoalContext.Provider value={value}>{children}</ActiveGoalContext.Provider>;
};

export const useActiveGoalContext = () => {
  const context = useContext(ActiveGoalContext);
  if (!context) {
    throw new Error("useActiveGoalContext must be used within a ActiveGoalProvider");
  }
  return context;
};
