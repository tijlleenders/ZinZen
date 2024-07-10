import { getChildrenGoals, getGoalById } from "@src/api/GoalsAPI";
import { getSharedWMChildrenGoals, getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { GoalItem } from "@src/models/GoalItem";
import { displayPartnerMode } from "@src/store";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

type TParentData = {
  parentGoal: GoalItem | undefined;
  subgoals: GoalItem[];
};

type Action =
  | { type: "SET_PARENT_GOAL"; payload: GoalItem | undefined }
  | { type: "SET_SUBGOALS"; payload: GoalItem[] }
  | { type: "RESET_STATE" };

const initialState: TParentData = {
  parentGoal: undefined,
  subgoals: [],
};

const parentGoalReducer = (parentData: TParentData, action: Action): TParentData => {
  switch (action.type) {
    case "SET_PARENT_GOAL":
      return { ...parentData, parentGoal: action.payload };
    case "SET_SUBGOALS":
      return { ...parentData, subgoals: action.payload };
    case "RESET_STATE":
      return initialState;
    default:
      return parentData;
  }
};

export const ParentGoalContext = createContext<{
  parentData: TParentData;
  dispatch: React.Dispatch<Action>;
}>({ parentData: initialState, dispatch: () => null });

export const ParentGoalProvider = ({ children }: { children: ReactNode }) => {
  const { parentId = "root" } = useParams();
  const [parentData, dispatch] = useReducer(parentGoalReducer, initialState);
  const isPartnerModeActive = useRecoilValue(displayPartnerMode);

  useEffect(() => {
    if (parentId !== "root") {
      (isPartnerModeActive ? getSharedWMGoalById(parentId) : getGoalById(parentId)).then((doc) =>
        dispatch({ type: "SET_PARENT_GOAL", payload: doc }),
      );
      (isPartnerModeActive ? getSharedWMChildrenGoals(parentId) : getChildrenGoals(parentId)).then((childGoals) =>
        dispatch({ type: "SET_SUBGOALS", payload: childGoals || [] }),
      );
      return;
    }
    dispatch({ type: "RESET_STATE" });
  }, [parentId, isPartnerModeActive]);

  const value = useMemo(() => ({ parentData, dispatch }), [parentData]);

  return <ParentGoalContext.Provider value={value}>{children}</ParentGoalContext.Provider>;
};

export const useParentGoalContext = () => {
  const context = useContext(ParentGoalContext);
  if (!context) {
    throw new Error("useParentGoalContext must be used within a ParentGoalProvider");
  }
  return context;
};
