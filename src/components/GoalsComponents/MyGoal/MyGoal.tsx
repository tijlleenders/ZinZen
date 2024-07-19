/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { darkModeState, displayPartnerMode } from "@src/store";
import { displayGoalId, displayUpdateGoal, goalsHistory, displayChangesModal, TAction } from "@src/store/GoalsState";
import { ILocationState, ImpossibleGoal } from "@src/Interfaces";

import GoalAvatar from "../GoalAvatar";
import GoalDropdown from "./GoalDropdown";
import GoalTitle from "./GoalTitle";

interface MyGoalProps {
  actionType: TAction;
  goal: ImpossibleGoal;
  showActions: {
    open: string;
    click: number;
  };
  setShowActions: React.Dispatch<
    React.SetStateAction<{
      open: string;
      click: number;
    }>
  >;
  dragAttributes?: any;
  dragListeners?: any;
}

const MyGoal: React.FC<MyGoalProps> = ({
  goal,
  actionType,
  showActions,
  setShowActions,
  dragAttributes,
  dragListeners,
}) => {
  const archived = goal.archived === "true";
  const defaultTap = { open: "root", click: 1 };
  const isActionVisible = !archived && showActions.open === goal.id && showActions.click > 0;

  const [expandGoalId, setExpandGoalId] = useState("root");
  const [isAnimating, setIsAnimating] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showPartnerMode = useRecoilValue(displayPartnerMode);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const showChangesModal = useRecoilValue(displayChangesModal);

  const handleGoalClick = () => {
    const newState: ILocationState = {
      ...location.state,
      activeGoalId: goal.id,
      goalsHistory: [
        ...subGoalHistory,
        {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "",
        },
      ],
    };
    if (newState.allowAddingBudgetGoal !== false) {
      newState.allowAddingBudgetGoal = goal.category !== "Standard";
    }
    navigate("/MyGoals", {
      state: newState,
    });
  };

  async function handleDropDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    const navState: ILocationState = { ...location.state, from: "" };
    if (goal.newUpdates) {
      navState.displayChanges = goal;
    } else {
      navState.displayGoalActions = { actionType, goal };
    }
    navigate("/MyGoals", { state: navState });
  }

  useEffect(() => {
    if (showActions !== defaultTap) {
      setShowActions(defaultTap);
    }
  }, [showChangesModal, showUpdateGoal, selectedGoalId]);

  useEffect(() => {
    if (location && location.pathname === "/MyGoals") {
      const { expandedGoalId } = location.state || {};
      setExpandGoalId(expandedGoalId);
      if (expandedGoalId && showActions.open !== expandedGoalId) {
        setShowActions({ open: expandedGoalId, click: 1 });
      }
    }
  }, [location]);

  return (
    <div
      key={String(`goal-${goal.id}`)}
      className={`user-goal${darkModeStatus ? "-dark" : ""} ${
        expandGoalId === goal.id && isAnimating ? "goal-glow" : ""
      }`}
    >
      <div
        className="user-goal-main"
        style={{
          ...(goal.typeOfGoal !== "myGoal" && goal.parentGoalId === "root" ? { width: "80%" } : {}),
        }}
      >
        <div style={{ touchAction: "none" }} onClickCapture={handleDropDown} {...dragAttributes} {...dragListeners}>
          <GoalDropdown goal={goal} isActionVisible={isActionVisible} />
        </div>
        <div aria-hidden className="goal-tile" onClick={handleGoalClick}>
          <GoalTitle goal={goal} isImpossible={goal.impossible} />
        </div>
      </div>
      {!showPartnerMode && goal.participants?.length > 0 && <GoalAvatar goal={goal} />}
    </div>
  );
};

export default MyGoal;
