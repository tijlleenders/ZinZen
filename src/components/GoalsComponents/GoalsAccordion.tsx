import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

import { GoalItem } from "@src/models/GoalItem";
import ZAccordion from "@src/common/Accordion";

import MyGoal from "./MyGoal/MyGoal";

interface IGoalsAccordionProps {
  header: string;
  goals: GoalItem[];
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
const GoalsAccordion: React.FC<IGoalsAccordionProps> = ({ header, goals, showActions, setShowActions }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div className="archived-drawer">
      {goals.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkModeStatus ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header,
              body: goals.map((goal: GoalItem) => (
                <MyGoal key={`goal-${goal.id}`} goal={goal} showActions={showActions} setShowActions={setShowActions} />
              )),
            },
          ]}
        />
      )}
    </div>
  );
};

export default GoalsAccordion;
