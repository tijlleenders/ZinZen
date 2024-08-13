import { TrashItem } from "@src/models/TrashItem";
import React, { createContext, useState } from "react";
import { useParams } from "react-router-dom";

type ArchivedGoalContext = {
  goal: TrashItem | undefined;
  setGoal: React.Dispatch<React.SetStateAction<TrashItem | undefined>>;
};

export const ArchivedGoalContext = createContext<ArchivedGoalContext | undefined>(undefined);

export const ArchivedGoalProvider = ({ children }: { children: React.ReactNode }) => {
  const { activeGoalId, partnerId } = useParams();
  const [goal, setGoal] = useState<TrashItem>();
  const isPartnerModeActive = !!partnerId;
};
