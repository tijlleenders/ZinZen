import { getChildrenGoals, getGoalById } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { useParams } from "react-router-dom";

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
  const { parent = "root" } = useParams();
  const [parentData, dispatch] = useReducer(parentGoalReducer, initialState);

  useEffect(() => {
    if (parent !== "root") {
      getGoalById(parent).then((doc) => dispatch({ type: "SET_PARENT_GOAL", payload: doc }));
      getChildrenGoals(parent).then((childGoals) => dispatch({ type: "SET_SUBGOALS", payload: childGoals || [] }));
      return;
    }
    dispatch({ type: "RESET_STATE" });
  }, [parent]);

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
