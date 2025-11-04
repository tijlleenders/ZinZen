import MyGoal, { ActionModal } from "@components/GoalsComponents/MyGoal/MyGoal";
import ZAccordion from "@src/common/Accordion";
import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";
import { GoalItem } from "@src/models/GoalItem";

const AvailableGoalHints = ({ hints }: { hints: GoalItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);

  return (
    <div className="archived-drawer">
      {hints && hints.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkMode ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header: "Hints",
              body: hints.map((goal) => (
                <MyGoal key={`goal-${goal.id}`} goal={{ ...goal, impossible: false }} actionModal={ActionModal.HINTS} />
              )),
            },
          ]}
        />
      )}
    </div>
  );
};

export default AvailableGoalHints;
