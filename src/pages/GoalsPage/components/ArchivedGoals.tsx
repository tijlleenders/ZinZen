import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import { unarchiveIcon } from "@src/assets";
import ZAccordion from "@src/common/Accordion";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import React from "react";
import { Outlet, useParams, useSearch } from "@tanstack/react-router";
import { useRecoilValue } from "recoil";
import { useDeleteGoal } from "@src/hooks/api/Goals/mutations/useDeleteGoal";
import { useRestoreArchivedGoal } from "@src/hooks/api/Goals/mutations/useRestoreArchivedGoal";
import { GoalActionsModal, Action } from "@components/GoalActionsModal";

const Actions = ({ goal }: { goal: GoalItem }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { deleteGoalMutation } = useDeleteGoal();
  const { mutate: restoreArchivedGoal } = useRestoreArchivedGoal();

  const handleRestoreClick = async () => {
    const goalTitleElement = document.querySelector(`#goal-${goal.id} .goal-title`) as HTMLElement;
    if (goalTitleElement) {
      goalTitleElement.style.textDecoration = "none";
    }
    await restoreArchivedGoal({ goal });
    window.history.back();
  };

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
      onClick: handleRestoreClick,
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

  return <GoalActionsModal goal={goal} actions={actions} onCancel={() => window.history.back()} />;
};

const ArchivedGoals = ({ goals }: { goals: GoalItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { showOptions } = useSearch({ strict: false }) as { showOptions: string };
  const { activeGoalId } = useParams({ strict: false });

  const archivedGoal = goals?.find((goal) => goal.id === activeGoalId);
  const showOptionsResult = !!showOptions && archivedGoal;

  return (
    <>
      <Outlet />
      {showOptionsResult && <Actions goal={archivedGoal} />}
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
                body: goals.map((goal) => <MyGoal key={`goal-${goal.id}`} goal={{ ...goal, impossible: false }} />),
              },
            ]}
          />
        </div>
      )}
    </>
  );
};

export default ArchivedGoals;
