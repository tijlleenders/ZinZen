import React, { useCallback, useEffect, useState } from "react";
import { ScheduleStatus } from "@src/Interfaces";
import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import useScheduler from "@src/hooks/useScheduler";
import { FormState, getFinalTags, checkSchedulingStatus } from "../ConfigGoal.helper";

interface ScheduleStatusDisplayProps {
  goal: GoalItem;
  formState: FormState;
  type: TGoalCategory;
  parentGoal?: GoalItem;
  dependencies: {
    simpleGoalDuration?: string;
    budgetAfterTime?: number;
    budgetBeforeTime?: number;
    budgetPerDayHrs?: { min: number; max: number };
    budgetPerWeekHrs?: { min: number; max: number };
  };
}

const ScheduleStatusDisplay: React.FC<ScheduleStatusDisplayProps> = ({
  goal,
  formState,
  type,
  parentGoal,
  dependencies,
}) => {
  const { checkGoalSchedule } = useScheduler();
  const [scheduleStatus, setScheduleStatus] = useState<ScheduleStatus>(null);

  const { simpleGoalDuration, budgetAfterTime, budgetBeforeTime, budgetPerDayHrs, budgetPerWeekHrs } = dependencies;

  const getScheduleStatusText = (status: ScheduleStatus) => {
    switch (status) {
      case "scheduled":
        return "Auto scheduled";
      case "impossible":
        return "! Impossible";
      case "future":
        return "Scheduled someday";
      default:
        return "";
    }
  };

  const checkSchedule = useCallback(async () => {
    setScheduleStatus("pending");
    try {
      const result = await checkGoalSchedule(getFinalTags({ goal, formState, type, parentGoal }));
      const status = await checkSchedulingStatus(result || undefined, goal.id);
      setScheduleStatus(status);
    } catch (error) {
      console.error("Failed to check schedule:", error);
      setScheduleStatus(null);
    }
  }, [checkGoalSchedule, goal, formState, type, parentGoal]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      checkSchedule();
    }, 1000);

    return () => clearTimeout(debounceTimer);
  }, [
    checkSchedule,
    simpleGoalDuration,
    budgetAfterTime,
    budgetBeforeTime,
    budgetPerDayHrs?.min,
    budgetPerDayHrs?.max,
    budgetPerWeekHrs?.min,
    budgetPerWeekHrs?.max,
  ]);

  if (!scheduleStatus) {
    return null;
  }

  return <div className={`schedule-status ${scheduleStatus}`}>{getScheduleStatusText(scheduleStatus)}</div>;
};

export default ScheduleStatusDisplay;
