import React from "react";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

import { GoalItem } from "@src/models/GoalItem";
import ZAccordion from "@src/common/Accordion";
import { TAction, displayGoalActions } from "@src/store/GoalsState";

import MyGoal from "./MyGoal/MyGoal";
import AccordionActions from "./MyGoalActions/AccordionActions";
import HintsAccordionActions from "./MyGoalActions/HintsAccordianAction";

interface IGoalsAccordionProps {
  header: "Done" | "Trash" | "Hints";
  goals: GoalItem[];
  showActions: {
    open: string;
    click: number;
  };
  setShowActions: React.Dispatch<
    React.SetStateAction<{
      open: string;
      click: number;
    }>
  >;
}

const actionsMap: {
  [key: string]: TAction;
} = {
  Done: "archived",
  Trash: "deleted",
  Hints: "hints",
};

const GoalsAccordion: React.FC<IGoalsAccordionProps> = ({ header, goals, showActions, setShowActions }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const actionType = actionsMap[header] || "regular";
  const showGoalActions = useRecoilValue(displayGoalActions);

  return (
    <div className="archived-drawer">
      {showGoalActions && ["archived", "deleted"].includes(showGoalActions.actionType) && (
        <AccordionActions open goal={showGoalActions.goal} actionType={showGoalActions.actionType} />
      )}
      {showGoalActions && ["hints"].includes(showGoalActions.actionType) && (
        <HintsAccordionActions open goal={showGoalActions.goal} />
      )}
      {goals.length > 0 && (
        <ZAccordion
          showCount
          style={{
            border: "none",
            background: darkModeStatus ? "var(--secondary-background)" : "transparent",
          }}
          panels={[
            {
              header,
              body: goals.map((goal: GoalItem) => (
                <MyGoal
                  actionType={actionType}
                  key={`goal-${goal.id}`}
                  goal={goal}
                  showActions={showActions}
                  setShowActions={setShowActions}
                />
              )),
            },
          ]}
        />
      )}
    </div>
  );
};

export default GoalsAccordion;
