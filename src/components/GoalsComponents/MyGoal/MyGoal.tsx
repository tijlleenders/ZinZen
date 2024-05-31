import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { darkModeState, displayPartnerMode } from "@src/store";
import { displayGoalId, displayUpdateGoal, displayChangesModal, TAction } from "@src/store/GoalsState";
import { ILocationState, ImpossibleGoal } from "@src/Interfaces";
import { moveGoalState } from "@src/store/moveGoalState";
import useNavigateToSubgoal from "@src/store/useNavigateToSubgoal";

import GoalAvatar from "../GoalAvatar";
import GoalSummary from "./GoalSummary/GoalSummary";
import GoalDropdown from "./GoalDropdown";
import GoalTitle from "./GoalTitle";

import "./index.scss";
import GoalMoveButton from "../MoveGoalButton";

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
}

const MyGoal: React.FC<MyGoalProps> = ({ goal, actionType, showActions, setShowActions }) => {
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
  const showChangesModal = useRecoilValue(displayChangesModal);
  const goalToMove = useRecoilValue(moveGoalState);
  const navigateToSubgoal = useNavigateToSubgoal();

  const shouldRenderMoveButton =
    goalToMove && goal.id !== goalToMove.id && goal.id !== goalToMove.parentGoalId && !archived;

  const handleGoalClick = () => {
    if (showActions.open === goal.id && showActions.click > 0) {
      navigateToSubgoal(goal);
    } else {
      setShowActions({ open: goal.id, click: 1 });
    }
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
    <>
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
          <div onClickCapture={handleDropDown}>
            <GoalDropdown goal={goal} isActionVisible={isActionVisible} />
          </div>
          <div aria-hidden className="goal-tile" onClick={handleGoalClick}>
            <GoalTitle goal={goal} isImpossible={goal.impossible} />
          </div>
          {shouldRenderMoveButton && <GoalMoveButton targetGoal={goal} />}
        </div>
        {!showPartnerMode && goal.participants?.length > 0 && <GoalAvatar goal={goal} />}
      </div>
      <div
        style={{
          marginLeft: "69px",
        }}
      >
        {showActions.open === goal.id && showActions.click > 0 && (
          <p className="goal-desc">
            <GoalSummary goal={goal} />
          </p>
        )}
      </div>
    </>
  );
};

export default MyGoal;
