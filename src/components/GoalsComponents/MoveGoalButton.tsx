import React from "react";
import { useRecoilState } from "recoil";
import { moveGoalState } from "@src/store/moveGoalState";
import { moveGoalHierarchy } from "@src/helpers/GoalController";
import ZButton from "@src/common/ZButton";
import { GoalItem } from "@src/models/GoalItem";
import useNavigateToSubgoal from "@src/store/useNavigateToSubgoal";

interface GoalMoveButtonProps {
  targetGoal: GoalItem;
}

const GoalMoveButton: React.FC<GoalMoveButtonProps> = ({ targetGoal }) => {
  const [selectedGoal, setSelectedGoal] = useRecoilState(moveGoalState);
  const navigateToSubgoal = useNavigateToSubgoal();

  const targetGoalId = targetGoal?.id;

  const handleClick = () => {
    if (selectedGoal && targetGoalId) {
      moveGoalHierarchy(selectedGoal, targetGoalId);
      navigateToSubgoal(targetGoal);
      setSelectedGoal(null);
    }
  };

  return (
    <ZButton className="move-goal-button" onClick={handleClick}>
      <span>Move Here</span>
    </ZButton>
  );
};

export default GoalMoveButton;
