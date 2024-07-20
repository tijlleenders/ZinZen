import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import ZAccordion from "@src/common/Accordion";
import { useActiveGoalContext } from "@src/contexts/activeGoal-context";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import React from "react";
import { useSearchParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

const HintGoals = ({ goals }: { goals: GoalItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);
  const [searchParams] = useSearchParams();
  const { goal: activeGoal } = useActiveGoalContext();
  const showOptions = !!searchParams.get("showOptions") && activeGoal;

  return (
    <div className="archived-drawer">
      {goals.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkMode ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header: "Done",
              body: goals.map((goal) => <MyGoal key={`goal-${goal.id}`} goal={goal} />),
            },
          ]}
        />
      )}
    </div>
  );
};

export default HintGoals;
