import React, { MutableRefObject } from "react";
import { Tour } from "antd";
import type { TourProps } from "antd";
import { useRecoilState } from "recoil";
import { moveGoalState } from "@src/store/moveGoalState";

interface MoveGoalGuideProps {
  goalComponentRef: MutableRefObject<HTMLDivElement | null>;
}

const MoveGoalGuide: React.FC<MoveGoalGuideProps> = ({ goalComponentRef }) => {
  const [goalToMove, setGoalToMove] = useRecoilState(moveGoalState);

  const steps: TourProps["steps"] = [
    {
      title: "Navigate to the goal you want to move into.",
      target: () => goalComponentRef.current as HTMLElement,
      nextButtonProps: {
        children: "Close",
        onClick: () => setGoalToMove(null),
      },
      placement: "bottom",
      className: "move-goal-guide",
    },
  ];
  return (
    <div>
      <Tour closable open={!!goalToMove} onClose={() => setGoalToMove(null)} steps={steps} />
    </div>
  );
};

export default MoveGoalGuide;
