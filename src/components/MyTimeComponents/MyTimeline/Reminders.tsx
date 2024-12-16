import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { getAllGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { useRecoilValue } from "recoil";
import { lastAction } from "@src/store";
import { ReminderOptions } from "./ReminderOptions";
import { GoalTiming } from "./GoalTiming";

import "./index.scss";

export const Reminders = ({ day }: { day: string }) => {
  const { t } = useTranslation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [reminders, setReminders] = useState<GoalItem[]>([]);

  const action = useRecoilValue(lastAction);

  useEffect(() => {
    const fetchReminders = async () => {
      const goals = await getAllGoals();
      const today = new Date();

      let targetDate: Date;
      if (day === "Today") {
        targetDate = today;
      } else if (day === "Tomorrow") {
        targetDate = new Date(today);
        targetDate.setDate(today.getDate() + 1);
      } else {
        const dayDate = new Date(today);
        while (dayDate.toLocaleDateString("en-us", { weekday: "long" }) !== day) {
          dayDate.setDate(dayDate.getDate() + 1);
        }
        targetDate = dayDate;
      }

      const dayReminders = goals.filter((goal) => {
        if (!goal.due || goal.duration || goal.archived === "true") {
          return false;
        }

        const dueDate = new Date(goal.due);
        return (
          dueDate.getDate() === targetDate.getDate() &&
          dueDate.getMonth() === targetDate.getMonth() &&
          dueDate.getFullYear() === targetDate.getFullYear()
        );
      });

      setReminders(dayReminders);
    };

    fetchReminders();
  }, [day, action]);

  const toggleTaskOptions = (reminderId: string) => {
    setActiveTaskId((prevTaskId) => (prevTaskId === reminderId ? null : reminderId));
  };

  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="MTL-display" style={{ marginTop: "10px" }}>
      <h4 style={{ marginBottom: "10px" }}>Reminders</h4>
      {reminders.map((reminder) => {
        const showTaskOptions = activeTaskId === reminder.id;
        return (
          <button
            key={reminder.id}
            className="MTL-taskItem simple"
            type="button"
            style={{ borderLeft: `6px solid ${reminder.goalColor}`, width: "100%" }}
            onClick={() => {
              toggleTaskOptions(reminder.id);
            }}
          >
            <GoalTiming startTime="0" endTime={null} showTaskOptions={showTaskOptions} displayEndTime={false} />
            <div className="MTL-taskTitleActionWrapper">
              <span style={{ textDecorationColor: reminder.goalColor }}>{t(`${reminder.title}`)}</span>
              {showTaskOptions ? <ReminderOptions reminder={reminder} handleActionClick={() => {}} /> : null}
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
