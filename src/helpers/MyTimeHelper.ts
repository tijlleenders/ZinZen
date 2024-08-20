import {
  IImpossibleTaskOfTheDay,
  IScheduleOfTheDay,
  ISchedulerInput,
  ISchedulerInputGoal,
  ISchedulerOutput,
  ISchedulerOutputGoal,
} from "@src/Interfaces/IScheduler";
import { ITaskOfDay } from "@src/Interfaces/Task";
import { addSchedulerRes, getFromOutbox, updateSchedulerCachedRes } from "@src/api/DumpboxAPI";
import { getAllGoals } from "@src/api/GoalsAPI";
import { getAllTasks, getAllBlockedTasks, adjustNotOnBlocks } from "@src/api/TasksAPI";
import { GoalItem } from "@src/models/GoalItem";
import { TCompletedTaskTiming, TaskItem, blockedSlotOfTask } from "@src/models/TaskItem";
import { convertDateToString } from "@src/utils";
import { t } from "i18next";

export const transformIntoSchInputGoals = (
  dbTasks: { [goalid: string]: TaskItem },
  activeGoals: GoalItem[],
  blockedSlots: { [goalid: string]: blockedSlotOfTask[] },
) => {
  const inputGoalsArr: ISchedulerInputGoal[] = [];
  activeGoals.forEach(async (ele) => {
    const obj: ISchedulerInputGoal = { id: ele.id, title: t(ele.title), filters: {}, createdAt: ele.createdAt };
    const slotsNotallowed = blockedSlots[ele.id];
    // obj.hoursSpent = dbTasks[ele.id]?.hoursSpent || 0;
    // obj.skippedToday = dbTasks[ele.id]?.skippedToday || [];
    if (ele.duration) obj.minDuration = Number(ele.duration);
    if (ele.start) {
      obj.start = convertDateToString(new Date(ele.start));
    }
    if (ele.due) {
      obj.deadline = convertDateToString(new Date(ele.due));
    }
    if (obj.filters) {
      if (ele.afterTime || ele.afterTime === 0) obj.filters.afterTime = ele.afterTime;
      if (ele.beforeTime || ele.beforeTime === 0) obj.filters.beforeTime = ele.beforeTime;
      if (ele.on) {
        obj.filters.onDays = ele.on.map((day) => day.toLowerCase());
      }
    }
    if (slotsNotallowed && slotsNotallowed.length > 0) {
      obj.notOn = [...slotsNotallowed];
    }
    if (ele.habit) obj.repeat = "weekly";
    if (ele.timeBudget) {
      const { perDay, perWeek } = ele.timeBudget;

      const [minPerDay, maxPerDay] = perDay
        ? perDay.split("-").map((val) => (val !== "" ? Number(val) : undefined))
        : [undefined, undefined];
      const [minPerWeek, maxPerWeek] = perWeek
        ? perWeek.split("-").map((val) => (val !== "" ? Number(val) : undefined))
        : [undefined, undefined];

      const budget = {
        minPerDay,
        maxPerDay,
        minPerWeek,
        maxPerWeek,
      };

      if (Object.values(budget).some((val) => val !== undefined)) {
        obj.budget = budget;
      }
    }
    if (ele.sublist.length > 0) obj.children = ele.sublist;
    if (ele.afterTime == null && ele.beforeTime == null) {
      delete obj.filters;
    }
    if (Object.keys(obj.filters || {}).length === 0) {
      delete obj.filters;
    }
    inputGoalsArr.push(obj);
  });
  return inputGoalsArr;
};

export const handleSchedulerOutput = async (_schedulerOutput: ISchedulerOutput | undefined) => {
  if (!_schedulerOutput) return {};
  const activeGoals = await getAllGoals();
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
    if (impossible) {
      impossible.forEach((task: IImpossibleTaskOfTheDay) => {
        if (task.id && !thisDay.impossible.includes(task.id)) {
          thisDay.impossible.push(task.id);
        }
      });
    }

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

export const organizeDataForInptPrep = async (inputGoals: GoalItem[]) => {
  const activeGoals = [...inputGoals];
  const _today = new Date();
  const startDate = convertDateToString(new Date(_today));
  const endDate = convertDateToString(new Date(_today.setDate(_today.getDate() + 7)));
  const tasksCompletedToday: TCompletedTaskTiming[] = [];
  getAllTasks().then((docs) =>
    docs.filter((doc) => doc.completedToday > 0).map((doc) => tasksCompletedToday.push(...doc.completedTodayTimings)),
  );

  const schedulerInput: ISchedulerInput = {
    startDate,
    endDate,
    goals: [],
    tasksCompletedToday,
  };
  const dbTasks: { [goalid: string]: TaskItem } = (await getAllTasks()).reduce(
    (acc, curr) => ({ ...acc, [curr.goalId]: curr }),
    {},
  );
  const blockedSlots: { [goalid: string]: blockedSlotOfTask[] } = await getAllBlockedTasks();
  console.log("blockedSlots", blockedSlots);

  const inputGoalsArr: ISchedulerInputGoal[] = transformIntoSchInputGoals(dbTasks, activeGoals, blockedSlots);
  const adjustedInputGoalsArr = await adjustNotOnBlocks(inputGoalsArr);
  schedulerInput.goals = adjustedInputGoalsArr;
  return { dbTasks, schedulerInput };
};

export const getCachedSchedule = async (generatedInputId: string) => {
  const schedulerCachedRes = await getFromOutbox("scheduler");

  if (!schedulerCachedRes) {
    return { code: "not-exist" };
  }

  const { uniqueId, output } = JSON.parse(schedulerCachedRes.value);

  if (!output) {
    return { code: "expired" };
  }

  return uniqueId === generatedInputId ? { code: "found", output: JSON.parse(output) } : { code: "expired" };
};

export const putSchedulerRes = async (code: string, generatedInputId: string, output: string) => {
  return code === "expired"
    ? updateSchedulerCachedRes(generatedInputId, output)
    : addSchedulerRes(generatedInputId, output);
};
