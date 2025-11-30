import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import { ActionModal } from "@components/GoalsComponents/MyGoal/types";
import ZAccordion from "@src/common/Accordion";
import { useGetArchivedGoals } from "@src/hooks/api/Goals/queries/useGetArchivedGoals";
import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";

const ArchivedGoals = ({ parentId }: { parentId: string }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { data: goals } = useGetArchivedGoals(parentId || "root");

  if (!goals) {
    return null;
  }

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
