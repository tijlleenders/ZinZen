import React from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { moveGoalState } from "@src/store/moveGoalState";
import { moveGoalHierarchy } from "@src/helpers/GoalController";
import ZButton from "@src/common/ZButton";
import { GoalItem } from "@src/models/GoalItem";
import useNavigateToSubgoal from "@src/store/useNavigateToSubgoal";
import { lastAction } from "@src/store";

interface GoalMoveButtonProps {
  targetGoal: GoalItem;
}

const GoalMoveButton: React.FC<GoalMoveButtonProps> = ({ targetGoal }) => {
  const navigateToSubgoal = useNavigateToSubgoal();
  const [selectedGoal, setSelectedGoal] = useRecoilState(moveGoalState);
  const setLastAction = useSetRecoilState(lastAction);

  const handleClick = () => {
    if (selectedGoal && targetGoal?.id) {
      moveGoalHierarchy(selectedGoal.id, targetGoal.id)
        .then(() => {
          setLastAction("goalMoved");
        })
        .then(() => {
          navigateToSubgoal(targetGoal);
        })
        .finally(() => {
          setSelectedGoal(null);
        });
    }
  };

  return (
    <ZButton className="move-goal-button" onClick={handleClick}>
      <span>Move Here</span>
    </ZButton>
  );
};

export default GoalMoveButton;
