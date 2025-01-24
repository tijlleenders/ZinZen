import { useState, useMemo } from "react";
import { GoalItem } from "@src/models/GoalItem";

export const useReminders = (reminderGoals: GoalItem[], day: string) => {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);

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

    return reminderGoals.filter((goal: GoalItem) => {
      if (!goal.due) return false;

      const dueDate = new Date(goal.due);

      if (day === "Today") {
        return dueDate <= targetDate;
      }

      return (
        dueDate.getDate() === targetDate.getDate() &&
        dueDate.getMonth() === targetDate.getMonth() &&
        dueDate.getFullYear() === targetDate.getFullYear()
      );
    });
  }, [reminderGoals, day]);

  const toggleTaskOptions = (reminderId: string) => {
    setActiveTaskId((prevTaskId) => (prevTaskId === reminderId ? null : reminderId));
  };

  return {
    reminders,
    activeTaskId,
    toggleTaskOptions,
  };
};
