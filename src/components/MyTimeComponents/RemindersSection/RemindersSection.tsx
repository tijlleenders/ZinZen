import React from "react";
import { GoalItem } from "@src/models/GoalItem";
import { archiveGoal } from "@src/helpers/GoalController";
import { useTranslation } from "react-i18next";
import "./RemindersSection.scss";

interface RemindersSectionProps {
  reminders: GoalItem[];
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({ reminders }) => {
  const { t } = useTranslation();

  if (!reminders?.length) return null;

  const handleComplete = async (reminder: GoalItem) => {
    await archiveGoal(reminder, []);
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
