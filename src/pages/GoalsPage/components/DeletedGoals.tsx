import MyGoal, { ActionModal } from "@components/GoalsComponents/MyGoal/MyGoal";
import ZAccordion from "@src/common/Accordion";
import { TrashItem } from "@src/models/TrashItem";
import { darkModeState } from "@src/store";
import React from "react";
import { Outlet } from "@tanstack/react-router";
import { useRecoilValue } from "recoil";

const DeletedGoals = ({ deletedGoals }: { deletedGoals: TrashItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);

  return (
    <div className="archived-drawer">
      <Outlet />
      {deletedGoals.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkMode ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header: "Trash",
              body: deletedGoals.map(({ deletedAt: _deletedAt, ...goal }) => (
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
