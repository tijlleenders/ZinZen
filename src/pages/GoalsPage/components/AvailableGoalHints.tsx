import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import { ActionModal } from "@components/GoalsComponents/MyGoal/types";
import ZAccordion from "@src/common/Accordion";
import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";

const AvailableGoalHints = ({ parentGoal }: { parentGoal: GoalItem }) => {
  const darkMode = useRecoilValue(darkModeState);
  const hints =
    parentGoal && parentGoal.hints?.availableGoalHints
      ? parentGoal.hints.availableGoalHints.map((hint) =>
          createGoalObjectFromTags({ ...hint, parentGoalId: parentGoal.id, id: hint.id }),
        )
      : [];

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
