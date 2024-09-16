import { GoalItem } from "@src/models/GoalItem";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type AvailableGoalHintContext = {
  goal: GoalItem | undefined;
  setGoal: React.Dispatch<React.SetStateAction<GoalItem | undefined>>;
};

export const AvailableGoalHintContext = createContext<AvailableGoalHintContext | undefined>(undefined);

export const AvailableGoalHintProvider = ({ children, goalHints }: { children: ReactNode; goalHints: GoalItem[] }) => {
  const { activeGoalId, partnerId } = useParams();
  const [goal, setGoal] = useState<GoalItem>();
  const isPartnerModeActive = !!partnerId;

  useEffect(() => {
    if (activeGoalId) {
      const hint = goalHints.find((goal) => {
        return goal.id === activeGoalId;
      });
      console.log(hint);
      setGoal(hint ? hint : undefined);
    }
  }, [isPartnerModeActive, activeGoalId]);

  const value = useMemo(() => ({ goal, setGoal }), [goal]);

  return <AvailableGoalHintContext.Provider value={value}>{children}</AvailableGoalHintContext.Provider>;
};

export const useAvailableGoalHintContext = () => {
  const context = useContext(AvailableGoalHintContext);
  if (!context) {
    throw new Error("useAvailableGoalHintContext must be used within a AvailableGoalHintContext");
  }
  return context;
};
