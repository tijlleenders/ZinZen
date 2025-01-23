import chevronLeftIcon from "@assets/images/chevronLeft.svg";
import { useTranslation } from "react-i18next";
import React from "react";
import { getAllReminders } from "@src/api/GoalsAPI";
import { useRecoilValue } from "recoil";
import { lastAction } from "@src/store";
import { useQuery } from "react-query";
import { ReminderOptions } from "./ReminderOptions";
import "../index.scss";
import { useMyTimelineStore } from "../useMyTimelineStore";
import { useReminders } from "./useReminder";

export const Reminders = ({ day }: { day: string }) => {
  const { t } = useTranslation();

  const { handleReminderActionClick } = useMyTimelineStore(day);
  const action = useRecoilValue(lastAction);

  const { data: reminderGoals = [] } = useQuery({
    queryKey: ["reminders", action],
    queryFn: () => getAllReminders(),
  });

  const { reminders, activeTaskId, toggleTaskOptions } = useReminders(reminderGoals, day);

  const isOverdue = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDateCopy = new Date(dueDate);
    dueDateCopy.setHours(0, 0, 0, 0);
    return dueDateCopy < today;
  };

  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="MTL-display">
      <h4 className="MTL-header">Reminders</h4>
      {reminders.map((reminder) => {
        const showTaskOptions = activeTaskId === reminder.id;
        const reminderIsOverdue = reminder.due && isOverdue(new Date(reminder.due));

        return (
          <button
            key={reminder.id}
            className="MTL-taskItem simple"
            type="button"
            style={{ borderLeft: `6px solid ${reminder.goalColor}` }}
            onClick={() => {
              toggleTaskOptions(reminder.id);
            }}
          >
            <div style={{ marginLeft: "60px" }} className="MTL-taskTitleActionWrapper">
              <span>
                {reminderIsOverdue ? "! " : ""}
                {t(`${reminder.title}`)}
              </span>
              {showTaskOptions ? (
                <ReminderOptions reminder={reminder} handleActionClick={handleReminderActionClick} />
              ) : null}
            </div>
            {showTaskOptions && (
              <img src={chevronLeftIcon} className="MyTime-expand-btw chevronDown theme-icon" alt="zinzen schedule" />
            )}
          </button>
        );
      })}
    </div>
  );
};
