import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import { archiveGoal } from "@src/helpers/GoalController";
import { useTranslation } from "react-i18next";
import "./RemindersSection.scss";
import { lastAction } from "@src/store";
import { useSetRecoilState } from "recoil";

interface RemindersSectionProps {
  reminders: GoalItem[];
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({ reminders }) => {
  const { t } = useTranslation();
  const setLastAction = useSetRecoilState(lastAction);

  if (!reminders?.length) return null;

  const handleComplete = async (reminder: GoalItem) => {
    await archiveGoal(reminder, []);
    setLastAction("reminderCompleted");
  };

  return (
    <div className="reminders-section">
      <h4 className="reminders-header">{t("Reminders")}</h4>
      <div className="reminders-list">
        {reminders.map((reminder) => (
          <div key={reminder.id} className="reminder-item" style={{ borderLeft: `3px solid ${reminder.goalColor}` }}>
            <span className="reminder-title">{reminder.title}</span>
            <button type="button" className="reminder-complete-btn" onClick={() => handleComplete(reminder)}>
              {t("Done")}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
