import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";

import { GoalItem } from "@src/models/GoalItem";

import { darkModeState, displayPartnerMode } from "@src/store";
import { displayGoalId, displayUpdateGoal, goalsHistory, displayChangesModal, TAction } from "@src/store/GoalsState";

import GoalAvatar from "../GoalAvatar";
import GoalSummary from "./GoalSummary/GoalSummary";
import GoalDropdown from "./GoalDropdown";
import GoalTitle from "./GoalTitle";
import { ILocationState } from "@src/Interfaces";

interface MyGoalProps {
  actionType: TAction;
  goal: GoalItem;
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

  const navigate = useNavigate();
  const location = useLocation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const showUpdateGoal = useRecoilValue(displayUpdateGoal);
  const showPartnerMode = useRecoilValue(displayPartnerMode);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const showChangesModal = useRecoilValue(displayChangesModal);

  const handleGoalClick = () => {
    if (showActions.open === goal.id && showActions.click > 0) {
      navigate("/MyGoals", {
        state: {
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
        },
      });
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
      if (expandedGoalId && showActions.open !== expandedGoalId) {
        setShowActions({ open: expandedGoalId, click: 1 });
      }
    }
  }, [location]);

  return (
    <div key={String(`goal-${goal.id}`)} className={`user-goal${darkModeStatus ? "-dark" : ""}`}>
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
          <GoalTitle goal={goal} />
          {showActions.open === goal.id && showActions.click > 0 && (
            <p className="goal-desc">
              <GoalSummary goal={goal} />
            </p>
          )}
        </div>
      </div>
      {!showPartnerMode && goal.participants?.length > 0 && <GoalAvatar goal={goal} />}
    </div>
  );
};

export default MyGoal;
