import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

import { GoalItem } from "@src/models/GoalItem";
import ZAccordion from "@src/common/Accordion";

import { useSearchParams } from "react-router-dom";
import { useActiveGoalContext } from "@src/contexts/activeGoal-context";
import { useDeletedGoalContext } from "@src/contexts/deletedGoal-context";
import MyGoal from "./MyGoal/MyGoal";
import AccordionActions from "./MyGoalActions/AccordionActions";
import HintsAccordionActions from "./MyGoalActions/HintsAccordianAction";

interface IGoalsAccordionProps {
  header: "Done" | "Trash" | "Hints";
  goals: GoalItem[];
}

const GoalsAccordion: React.FC<IGoalsAccordionProps> = ({ header, goals }) => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const [searchParams] = useSearchParams();
  const showOptions = !!searchParams.get("showOptions") && activeGoal;
  const { goal: activeGoal } = useActiveGoalContext();
  const { goal: deleteGoal } = useDeletedGoalContext();

  return (
    <div className="archived-drawer">
      {showOptions && header === "Hints" && <HintsAccordionActions open goal={activeGoal} />}

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
              body: goals.map((goal: GoalItem) => <MyGoal key={`goal-${goal.id}`} goal={goal} />),
            },
          ]}
        />
      )}
    </div>
  );
};

export default GoalsAccordion;
