import { IScheduleOfTheDay, ISchedulerInputGoal, ISchedulerOutput, ISchedulerOutputGoal } from "@src/Interfaces/IScheduler";
import { ITaskOfDay } from "@src/Interfaces/Task";
import { GoalItem } from "@src/models/GoalItem";
import { TaskItem, blockedSlotOfTask } from "@src/models/TaskItem";
import { convertDateToString, convertOnFilterToArray } from "@src/utils";

export const transformIntoSchInputGoals = (
  dbTasks: { [goalid: string]: TaskItem },
  activeGoals: GoalItem[],
  noDurationGoalIds: string[],
  blockedSlots: { [goalid: string]: blockedSlotOfTask[] }
) => {
  const inputGoalsArr: ISchedulerInputGoal[] = [];
  activeGoals.forEach(async (ele) => {
    const obj: ISchedulerInputGoal = { id: ele.id, title: ele.title, filters: {}, createdAt: ele.createdAt };
    const slotsNotallowed = blockedSlots[ele.id];
    if (dbTasks[ele.id]?.hoursSpent) { obj.hoursSpent = dbTasks[ele.id].hoursSpent; }
    if (dbTasks[ele.id]?.forgotToday) { obj.skippedToday = dbTasks[ele.id].forgotToday; }
    if (ele.duration) obj.min_duration = Number(ele.duration);
    if (ele.start) {
      obj.start = convertDateToString(new Date(ele.start));
    }
    if (ele.due) {
      obj.deadline = convertDateToString(new Date(ele.due));
    }
    if (obj.filters) {
      if (ele.afterTime || ele.afterTime === 0) obj.filters.after_time = ele.afterTime;
      if (ele.beforeTime || ele.beforeTime === 0) obj.filters.before_time = ele.beforeTime;
      if (ele.on) obj.filters.on_days = convertOnFilterToArray(ele.on);
      if (slotsNotallowed && slotsNotallowed.length > 0) { obj.filters.not_on = [...slotsNotallowed]; }
    }
    if (ele.habit) obj.repeat = ele.habit.toLowerCase();
    if (ele.timeBudget) {
      obj.budgets = [{ budget_type: ele.timeBudget.period === "day" ? "Daily" : "Weekly", min: Number(ele.timeBudget.duration) }];
      if (!ele.duration) { obj.min_duration = Number(ele.timeBudget.duration); }
    }
    if (ele.sublist.length > 0) obj.children = ele.sublist.filter((id) => !noDurationGoalIds.includes(id));
    if (Object.keys(obj.filters || {}).length === 0) { delete obj.filters; }
    inputGoalsArr.push(obj);
  });
  return inputGoalsArr;
};
