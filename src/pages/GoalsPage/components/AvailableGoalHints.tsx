import MyGoal from "@components/GoalsComponents/MyGoal/MyGoal";
import { unarchiveIcon } from "@src/assets";
import ZAccordion from "@src/common/Accordion";
import { darkModeState } from "@src/store";
import React from "react";
import { useRecoilValue } from "recoil";
import { useParams, useSearch } from "@tanstack/react-router";
import { GoalItem } from "@src/models/GoalItem";
import { GoalActionsModal, Action } from "@components/GoalActionsModal";
import { useDeleteGoalHint } from "@src/hooks/api/Hints/mutations/useDeleteGoalHint";
import { useReportGoalHints } from "@src/hooks/api/Hints/mutations/useReportGoalHints";
import { useAddGoalHintsToMyGoal } from "@src/hooks/api/Hints/mutations/useAddGoalHintsToMyGoal";

const Actions = ({ goal }: { goal: GoalItem }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { deleteGoalHint } = useDeleteGoalHint();
  const { reportGoalHint, isReportingGoalHint } = useReportGoalHints();
  const { addGoalHintToMyGoal } = useAddGoalHintsToMyGoal();

  const actions: Action[] = [
    {
      label: "Delete",
      icon: "Delete",
      onClick: deleteGoalHint,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "deleteHint",
    },
    {
      label: "Add",
      icon: "Add",
      onClick: () => addGoalHintToMyGoal(goal),
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "addHint",
    },
    {
      label: "Report",
      icon: (
        <img
          alt="archived goal"
          src={unarchiveIcon}
          width={24}
          height={25}
          style={{ filter: darkMode ? "invert(1)" : "none" }}
        />
      ),
      onClick: () => reportGoalHint(goal),
      loading: isReportingGoalHint,
      requiresConfirmation: true,
      confirmationCategory: "goal",
      confirmationAction: "reportHint",
    },
  ];

  return <GoalActionsModal goal={goal} actions={actions} />;
};

const AvailableGoalHints = ({ hints }: { hints: GoalItem[] }) => {
  const darkMode = useRecoilValue(darkModeState);
  const { showOptions } = useSearch({ strict: false }) as { showOptions: string };
  const { activeGoalId } = useParams({ strict: false });

  const goalHint = hints?.find((goal) => goal.id === activeGoalId);
  const showOptionsResult = !!showOptions && goalHint;

  return (
    <div className="archived-drawer">
      {showOptionsResult && <Actions goal={goalHint} />}
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
              body: hints.map((goal) => <MyGoal key={`goal-${goal.id}`} goal={{ ...goal, impossible: false }} />),
            },
          ]}
        />
      )}
    </div>
  );
};

export default AvailableGoalHints;
