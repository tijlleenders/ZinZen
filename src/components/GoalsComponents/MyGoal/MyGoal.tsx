import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { darkModeState, displayPartnerMode } from "@src/store";
import { goalsHistory } from "@src/store/GoalsState";
import { ILocationState, ImpossibleGoal } from "@src/Interfaces";

import GoalAvatar from "../GoalAvatar";
import GoalTitle from "./GoalTitle";
import GoalDropdown from "./GoalDropdown";

interface MyGoalProps {
  goal: ImpossibleGoal;
}

const MyGoal: React.FC<MyGoalProps> = ({ goal }) => {
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
  const showPartnerMode = useRecoilValue(displayPartnerMode);
  const subGoalHistory = useRecoilValue(goalsHistory);

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
      // navState.displayGoalActions = { actionType, goal };
    }
    navigate("/MyGoals", { state: navState });
  }

  useEffect(() => {
    if (location && location.pathname === "/MyGoals") {
      const { expandedGoalId } = location.state || {};
      setExpandGoalId(expandedGoalId);
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
        <div onClickCapture={handleDropDown}>
          <GoalDropdown goal={goal} />
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
