import MyGoal, { ActionModal } from "@components/GoalsComponents/MyGoal/MyGoal";
import ZAccordion from "@src/common/Accordion";
import { TrashItem } from "@src/models/TrashItem";
import { darkModeState } from "@src/store";
import React from "react";
import { Outlet, useParams, useSearch } from "@tanstack/react-router";
import { useRecoilValue } from "recoil";
import { unarchiveIcon } from "@src/assets";
import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { useRestoreDeletedGoal } from "@src/hooks/api/Goals/mutations/useRestoreDeletedGoal";
import { GoalActionsModal, Action } from "@components/GoalActionsModal";

const Actions = ({ goal }: { goal: TrashItem }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { restoreDeletedGoalMutation } = useRestoreDeletedGoal();
  const { deleteGoalMutation } = useDeleteGoal();

  const actions: Action[] = [
    {
      label: "Restore",
      icon: (
        <img
          alt="archived goal"
          src={unarchiveIcon}
          width={24}
          height={25}
          style={{ filter: darkMode ? "invert(1)" : "none" }}
        />
      ),
      onClick: () => restoreDeletedGoalMutation({ goal }),
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "restore",
    },
    {
      label: "Delete",
      icon: "Delete",
      onClick: () => deleteGoalMutation(goal),
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "delete",
    },
  ];

  return <GoalActionsModal goal={goal} actions={actions} />;
};

const DeletedGoals = ({ deletedGoals }: { deletedGoals: TrashItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { showOptions } = useSearch({ strict: false }) as { showOptions: string };
  const { activeGoalId } = useParams({ strict: false });

  const deletedGoal = deletedGoals?.find((goal) => goal.id === activeGoalId);
  const showOptionsResult = !!showOptions && deletedGoal;

  return (
    <div className="archived-drawer">
      <Outlet />
      {showOptionsResult && <Actions goal={deletedGoal} />}
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
