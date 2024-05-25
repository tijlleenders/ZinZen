import React, { useRef } from "react";
import { Tour } from "antd";
import type { TourProps } from "antd";
import { useRecoilState } from "recoil";
import { moveGoalState } from "@src/store/moveGoalState";

const MoveGoalGuide: React.FC = ({ goalComponentRef }: { goalComponentRef: React.MutableRefObject<null> }) => {
  const [moveGoal, setMoveGoal] = useRecoilState(moveGoalState);

  const steps: TourProps["steps"] = [
    {
      title: "Navigate to the goal you want to move into.",
      target: () => goalComponentRef.current,
      nextButtonProps: {
        children: "Close",
      },
      placement: "bottom",
      className: "move-goal-guide",
    },
  ];
  return (
    <div>
      <Tour closable open={!!moveGoal} onClose={() => setMoveGoal(null)} steps={steps} />
    </div>
  );
};

export default MoveGoalGuide;
