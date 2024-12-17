import React from "react";
import { TaskAction } from "@src/Interfaces/Task";
import { GoalItem } from "@src/models/GoalItem";

interface ReminderOptionsProps {
  reminder: GoalItem;
  handleActionClick: (action: TaskAction, reminder: GoalItem) => void;
}

const ActionButton: React.FC<{
  action: TaskAction;
  reminder: GoalItem;
  last?: boolean;
  onActionClick: (action: TaskAction, reminder: GoalItem) => void;
}> = ({ action, reminder, last = false, onActionClick }) => (
  <button type="button" onClick={() => onActionClick(action, reminder)} className={last ? "last-btn" : ""}>
    {action}
  </button>
);

ActionButton.defaultProps = {
  last: false,
};

export const ReminderOptions: React.FC<ReminderOptionsProps> = ({ reminder, handleActionClick }) => {
  return (
    <div className="MTL-options">
      <ActionButton action={TaskAction.Done} reminder={reminder} onActionClick={handleActionClick} />
      <ActionButton action={TaskAction.Focus} reminder={reminder} onActionClick={handleActionClick} />
      <ActionButton action={TaskAction.Goal} reminder={reminder} onActionClick={handleActionClick} last />
    </div>
  );
};
