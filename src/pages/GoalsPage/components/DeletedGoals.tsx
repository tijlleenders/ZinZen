import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import { ActionModal } from "@components/GoalsComponents/MyGoal/types";
import ZAccordion from "@src/common/Accordion";
import { useGetDeletedGoals } from "@src/hooks/api/Goals/queries/useGetDeletedGoals";
import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";

const DeletedGoals = ({ parentId }: { parentId: string }) => {
  const darkMode = useRecoilValue(darkModeState);

  const { data: goals } = useGetDeletedGoals(parentId || "root");

  if (!goals) {
    return null;
  }

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
              header: "Trash",
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              body: goals.map(({ deletedAt: _deletedAt, ...goal }) => (
                <MyGoal
                  key={`goal-${goal.id}`}
                  goal={{ ...goal, impossible: false }}
                  actionModal={ActionModal.DELETED}
                />
              )),
            },
          ]}
        />
      )}
    </div>
  );
};

export default DeletedGoals;
