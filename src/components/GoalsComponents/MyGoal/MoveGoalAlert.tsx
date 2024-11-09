import React from "react";
import { Alert } from "antd";
import { useRecoilState } from "recoil";
import { moveGoalState } from "@src/store/moveGoalState";
import "./index.scss";

const MoveGoalAlert: React.FC = () => {
  const [goalToMove, setGoalToMove] = useRecoilState(moveGoalState);

  if (!goalToMove) return null;

  return (
    <div className="move-goal-toast">
      <Alert
        message="Move Goal"
        description="Navigate to the new location and press + button to move."
        type="info"
        showIcon
        closable
        onClose={() => setGoalToMove(null)}
      />
    </div>
  );
};

export default MoveGoalAlert;
