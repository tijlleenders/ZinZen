import { getDeletedGoalById } from "@src/api/TrashAPI";
import { TrashItem } from "@src/models/TrashItem";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

type DeletedGoalContext = {
  goal: TrashItem | undefined;
  setGoal: React.Dispatch<React.SetStateAction<TrashItem | undefined>>;
};

export const DeletedGoalContext = createContext<DeletedGoalContext | undefined>(undefined);

export const DeletedGoalProvider = ({ children }: { children: ReactNode }) => {
  const { activeGoalId, partnerId } = useParams();
  const [goal, setGoal] = useState<TrashItem>();
  const isPartnerModeActive = !!partnerId;

  useEffect(() => {
    if (activeGoalId) {
      getDeletedGoalById(activeGoalId).then((doc) => {
        setGoal(doc);
      });
      return;
    }
    setGoal(undefined);
  }, [isPartnerModeActive, activeGoalId]);

  const value = useMemo(() => ({ goal, setGoal }), [goal]);

  return <DeletedGoalContext.Provider value={value}>{children}</DeletedGoalContext.Provider>;
};

export const useDeletedGoalContext = () => {
  const context = useContext(DeletedGoalContext);
  if (!context) {
    throw new Error("useDeletedGoalContext must be used within a DeletedGoalProvider");
  }
  return context;
};
