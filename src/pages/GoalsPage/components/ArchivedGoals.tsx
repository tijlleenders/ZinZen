import MyGoal, { ActionModal } from "@components/GoalsComponents/MyGoal/MyGoal";
import ZAccordion from "@src/common/Accordion";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";

const ArchivedGoals = ({ goals }: { goals: GoalItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);

  return (
    <div>
      {goals.length > 0 && (
        <div className="archived-drawer">
          <ZAccordion
            showCount
            style={{
              border: "none",
              background: darkMode ? "var(--secondary-background)" : "transparent",
            }}
            panels={[
              {
                header: "Done",
                body: goals.map((goal) => (
                  <MyGoal
                    key={`goal-${goal.id}`}
                    goal={{ ...goal, impossible: false }}
                    actionModal={ActionModal.ARCHIVED}
                  />
                )),
              },
            ]}
          />
        </div>
      )}
    </div>
  );
};

export default ArchivedGoals;
