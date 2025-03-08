import { useMemo } from "react";
import { GoalItem } from "@src/models/GoalItem";
import { getAllReminders } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";

/**
 * Custom hook to manage and filter reminders based on the selected day
 * @param day - String representing the selected day ("Today", "Tomorrow", or weekday name)
 * @returns Object containing filtered reminders for the selected day
 */
export const useGetRemindersForSelectedDay = (day: string) => {
  const { data: reminderGoals = [] } = useQuery({
    queryKey: ["reminders"],
    queryFn: () => getAllReminders(),
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

  return {
    reminders,
  };
};
