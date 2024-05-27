import React from "react";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";
import { moveGoalState } from "@src/store/moveGoalState";
import { moveGoalHierarchy } from "@src/helpers/GoalController";
import ZButton from "@src/common/ZButton";
import { ILocationState } from "@src/Interfaces";
import { GoalItem } from "@src/models/GoalItem";
import useNavigateToSubgoal from "@src/store/useNavigateToSubgoal";

interface GoalMoveButtonProps {
  type: "select" | "move";
  goal?: GoalItem;
  targetGoal?: GoalItem;
}

const GoalMoveButton: React.FC<GoalMoveButtonProps> = ({ goal, targetGoal, type }) => {
  const navigate = useNavigate();
  const { state }: { state: ILocationState } = useLocation();
  const [selectedGoal, setSelectedGoal] = useRecoilState(moveGoalState);
  const navigateToSubgoal = useNavigateToSubgoal();

  const targetGoalId = targetGoal?.id;

  const handleClick = () => {
    if (type === "select") {
      if (goal) {
        setSelectedGoal(goal);
        navigate("/MyGoals", { state: { ...state, displayUpdateGoal: undefined } });
      }
    } else if (type === "move") {
      if (selectedGoal && targetGoalId) {
        moveGoalHierarchy(selectedGoal, targetGoalId);
        navigateToSubgoal(targetGoal);
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
