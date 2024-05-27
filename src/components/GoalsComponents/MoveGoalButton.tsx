import React from "react";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import { moveGoalState } from "@src/store/moveGoalState";
import { moveGoalHierarchy } from "@src/helpers/GoalController";
import ZButton from "@src/common/ZButton";
import { ILocationState } from "@src/Interfaces";
import { GoalItem } from "@src/models/GoalItem";

interface GoalMoveButtonProps {
  type: "select" | "move";
  goal?: GoalItem;
  targetGoalId?: string;
}

const GoalMoveButton: React.FC<GoalMoveButtonProps> = ({ goal, targetGoalId, type }) => {
  const navigate = useNavigate();
  const { state }: { state: ILocationState } = useLocation();
  const [selectedGoal, setSelectedGoal] = useRecoilState(moveGoalState);

  const handleClick = () => {
    if (type === "select") {
      if (goal) {
        setSelectedGoal(goal);
        navigate("/MyGoals", { state: { ...state, displayUpdateGoal: undefined } });
      }
    } else if (type === "move") {
      if (selectedGoal && targetGoalId) {
        moveGoalHierarchy(selectedGoal, targetGoalId);
        setSelectedGoal(null);
      }
    }
  };

  return (
    <ZButton className="move-goal-button" onClick={handleClick}>
      {type === "move" ? "Move Goal Here" : "Move Goal"}
    </ZButton>
  );
};

export default GoalMoveButton;
