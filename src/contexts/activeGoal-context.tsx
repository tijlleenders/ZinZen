import { getGoalById } from "@src/api/GoalsAPI";
import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { GoalItem } from "@src/models/GoalItem";
import { displayPartnerMode } from "@src/store";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

type ActiveGoalContext = {
  goal: GoalItem | undefined;
  setGoal: React.Dispatch<React.SetStateAction<GoalItem | undefined>>;
};

export const ActiveGoalContext = createContext<ActiveGoalContext | undefined>(undefined);

export const ActiveGoalProvider = ({ children }: { children: ReactNode }) => {
  const { activeGoalId } = useParams();
  const [goal, setGoal] = useState<GoalItem>();
  const isPartnerModeActive = useRecoilValue(displayPartnerMode);

  useEffect(() => {
    if (activeGoalId) {
      (isPartnerModeActive ? getSharedWMGoalById(activeGoalId) : getGoalById(activeGoalId)).then((doc) => setGoal(doc));
      return;
    }
    setGoal(undefined);
  }, [isPartnerModeActive, activeGoalId]);

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
