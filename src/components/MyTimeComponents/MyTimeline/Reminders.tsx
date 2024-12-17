import chevronLeftIcon from "@assets/images/chevronLeft.svg";
import { useTranslation } from "react-i18next";
import React, { useMemo, useState } from "react";
import { getAllGoals } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { useRecoilValue } from "recoil";
import { lastAction } from "@src/store";
import { useQuery } from "react-query";
import { ReminderOptions } from "./ReminderOptions";
import { GoalTiming } from "./GoalTiming";
import "./index.scss";
import { useMyTimelineStore } from "./useMyTimelineStore";

export const Reminders = ({ day }: { day: string }) => {
  const { t } = useTranslation();
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const action = useRecoilValue(lastAction);

  const { handleReminderActionClick } = useMyTimelineStore(day);

  const { data: goals = [] } = useQuery({
    queryKey: ["reminders", action],
    queryFn: () => getAllGoals(),
  });

  const reminders = useMemo(() => {
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

    return goals.filter((goal: GoalItem) => {
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
  }, [goals, day]);

  const toggleTaskOptions = (reminderId: string) => {
    setActiveTaskId((prevTaskId) => (prevTaskId === reminderId ? null : reminderId));
  };

  if (reminders.length === 0) {
    return null;
  }

  return (
    <div className="MTL-display" style={{ marginTop: "10px" }}>
      <h4 style={{ marginBottom: "10px", marginLeft: "4%" }}>Reminders</h4>
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
            <div style={{ display: "hidden" }}>
              <GoalTiming startTime="0" endTime={null} showTaskOptions={showTaskOptions} displayEndTime={false} />
            </div>
            <div className="MTL-taskTitleActionWrapper">
              <span>{t(`${reminder.title}`)}</span>
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
