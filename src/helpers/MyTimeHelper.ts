import {
  IScheduleOfTheDay,
  ISchedulerInputGoal,
  ISchedulerOutput,
  ISchedulerOutputGoal,
} from "@src/Interfaces/IScheduler";
import { ITaskOfDay } from "@src/Interfaces/Task";
import { addSchedulerRes, getFromOutbox, updateSchedulerCachedRes } from "@src/api/DumpboxAPI";
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
    if (dbTasks[ele.id]?.hoursSpent) {
      obj.hoursSpent = dbTasks[ele.id].hoursSpent;
    }
    if (dbTasks[ele.id]?.forgotToday) {
      obj.skippedToday = dbTasks[ele.id].forgotToday;
    }
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
      if (slotsNotallowed && slotsNotallowed.length > 0) {
        obj.filters.not_on = [...slotsNotallowed];
      }
    }
    if (ele.habit) obj.repeat = ele.habit.toLowerCase();
    if (ele.timeBudget) {
      obj.budgets = [
        { budget_type: ele.timeBudget.period === "day" ? "Daily" : "Weekly", min: Number(ele.timeBudget.duration) },
      ];
      if (!ele.duration) {
        obj.min_duration = Number(ele.timeBudget.duration);
      }
    }
    if (ele.sublist.length > 0) obj.children = ele.sublist.filter((id) => !noDurationGoalIds.includes(id));
    if (Object.keys(obj.filters || {}).length === 0) {
      delete obj.filters;
    }
    inputGoalsArr.push(obj);
  });
  return inputGoalsArr;
};

export const handleSchedulerOutput = (_schedulerOutput: ISchedulerOutput, activeGoals: GoalItem[]) => {
  const obj: {
    [goalid: string]: {
      parentGoalId: string;
      goalColor: string;
    };
  } = {};
  const res: { [dayName: string]: ITaskOfDay } = {};
  const { scheduled, impossible } = _schedulerOutput;
  activeGoals.forEach((goal) => {
    obj[goal.id] = {
      parentGoalId: goal.parentGoalId,
      goalColor: goal.goalColor,
    };
  });
  const _today = new Date();
  scheduled.forEach((dayOutput: IScheduleOfTheDay, index: number) => {
    const thisDay: ITaskOfDay = {
      freeHrsOfDay: 0,
      scheduledHrs: 0,
      scheduled: [],
      impossible: [],
      colorBands: [],
    };
    impossible[index].tasks.forEach((ele: ISchedulerOutputGoal) => {
      const { goalColor, parentGoalId } = obj[ele.goalid];
      thisDay.impossible.push({ ...ele, goalColor, parentGoalId });
    });
    dayOutput.tasks.forEach((ele: ISchedulerOutputGoal) => {
      if (ele.title !== "free" && obj[ele.goalid]) {
        const { goalColor, parentGoalId } = obj[ele.goalid];
        thisDay.scheduledHrs += ele.duration;
        thisDay.scheduled.push({
          ...ele,
          goalColor,
          parentGoalId,
          duration: ele.duration,
        });
      } else {
        thisDay.freeHrsOfDay += ele.duration;
      }
    });
    let durationAcc = 0;
    dayOutput.tasks.forEach((ele) => {
      durationAcc += ele.duration;
      thisDay.colorBands.push({
        goalId: ele.goalid,
        duration: ele.duration,
        style: {
          width: `${(durationAcc / 24) * 100}%`,
          background: ele.title === "free" ? "#d9cccc" : obj[ele.goalid].goalColor,
        },
      });
    });
    if (index === 0) {
      res.Today = thisDay;
    } else if (index === 1) {
      res.Tomorrow = thisDay;
    } else res[`${_today.toLocaleDateString("en-us", { weekday: "long" })}`] = thisDay;
    _today.setDate(_today.getDate() + 1);
    thisDay.freeHrsOfDay = 24 - thisDay.scheduledHrs;
  });
  return res;
};

export const getCachedSchedule = async (generatedInputId: string) => {
  const schedulerCachedRes = await getFromOutbox("scheduler");
  if(!schedulerCachedRes) {
    return { code: "not-exist"};
  }
  const { uniqueId, output } = JSON.parse(schedulerCachedRes.value);
  return uniqueId === generatedInputId ? 
    { 
      code: "found",
      output: JSON.parse(output)
    }
    : { code: "expired" }; 
}

export const putSchedulerRes = async (code: string, generatedInputId: string, output: string) => {  
  return await ( code === "expired" 
    ? updateSchedulerCachedRes(generatedInputId, output)
    : addSchedulerRes(generatedInputId, output)
  );
}