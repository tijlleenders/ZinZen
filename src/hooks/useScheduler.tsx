/* eslint-disable import/no-relative-packages */
import { useRecoilState, useRecoilValue } from "recoil";
import { useEffect, useState } from "react";

import rescheduleTune from "@assets/reschedule.mp3";

import { GoalItem } from "@src/models/GoalItem";
import { ITaskOfDay } from "@src/Interfaces/Task";
import { callJsScheduler } from "@src/scheduler/miniScheduler";
import { createDummyGoals } from "@src/helpers/NewUserController";
import { convertDateToString } from "@src/utils";
import { lastAction, openDevMode } from "@src/store";
import { getAllGoals, getActiveGoals } from "@src/api/GoalsAPI";
import { TaskItem, blockedSlotOfTask } from "@src/models/TaskItem";
import { generateUniqueIdForSchInput } from "@src/utils/SchedulerUtils";
import { getAllTasks, getAllBlockedTasks } from "@src/api/TasksAPI";
import { ISchedulerInputGoal, ISchedulerOutput } from "@src/Interfaces/IScheduler";
import { getCachedSchedule, handleSchedulerOutput, putSchedulerRes, transformIntoSchInputGoals } from "@src/helpers/MyTimeHelper";

import init, { schedule } from "../../pkg/scheduler";

function useScheduler() {
  const rescheduleSound = new Audio(rescheduleTune);

  const [tasksStatus, setTasksStatus] = useState<{ [goalId: string]: TaskItem }>({});
  const devMode = useRecoilValue(openDevMode);
  const [tasks, setTasks] = useState<{ [day: string]: ITaskOfDay }>({});
  const [action, setLastAction] = useRecoilState(lastAction);

  const initialCall = async () => {
    const _today = new Date();
    const noDurationGoalIds: string[] = [];
    const startDate = convertDateToString(new Date(_today));
    const endDate = convertDateToString(new Date(_today.setDate(_today.getDate() + 7)));
    const schedulerInput: {
      startDate: string,
      endDate: string,
      goals: { [goalid: string]: ISchedulerInputGoal }
    } = {
      startDate,
      endDate,
      goals: {}
    };
    let activeGoals: GoalItem[] = await getAllGoals();

    if (activeGoals.length === 0) { await createDummyGoals(); activeGoals = await getActiveGoals(); }
    console.log(activeGoals);

    const dbTasks: { [goalid: string]: TaskItem } = (await getAllTasks()).reduce((acc, curr) => ({ ...acc, [curr.goalId]: curr }), {});
    setTasksStatus({ ...dbTasks });

    const blockedSlots: { [goalid: string]: blockedSlotOfTask[] } = await getAllBlockedTasks();

    await init();

    activeGoals = [...activeGoals.filter((ele) => {
      if (!ele.duration && !ele.timeBudget) noDurationGoalIds.push(ele.id);
      return !!(ele.duration) || ele.timeBudget;
    })];

    const inputGoalsArr: ISchedulerInputGoal[] = transformIntoSchInputGoals(
      dbTasks, activeGoals, noDurationGoalIds, blockedSlots
    );
    schedulerInput.goals = inputGoalsArr.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});

    console.log("input", JSON.stringify(schedulerInput));
    console.log(schedulerInput);

    const generatedInputId = generateUniqueIdForSchInput(JSON.stringify(schedulerInput));
    console.log("🚀 ~ file: useScheduler.tsx:70 ~ initialCall ~ generatedInputId:", generatedInputId)
    const cachedRes = await getCachedSchedule(generatedInputId);

    let res: ISchedulerOutput;
    console.log("🚀 ~ file: useScheduler.tsx:75 ~ initialCall ~ cachedRes.code:", cachedRes.code)
    if (cachedRes.code === "found") {
      res = cachedRes.output;
    } else {
      res = !devMode ? callJsScheduler(schedulerInput) : schedule(schedulerInput);
    }
    if (cachedRes.code !== "found") {
      putSchedulerRes(cachedRes.code, generatedInputId, JSON.stringify(res))
        .then(() => console.log("schedule saved"))
        .catch(() => console.log("failed to save scheduler output"));
    }
    console.log("output", res);

    const processedOutput = handleSchedulerOutput(res, activeGoals);
    setTasks({ ...processedOutput });

  };

  useEffect(() => {
    initialCall();
  }, [devMode]);
  useEffect(() => {
    if (action.includes("Task")) {
      if (action === "TaskRescheduled") rescheduleSound.play();
      initialCall().then(async () => {
        setLastAction("none");
      });
    }
  }, [action]);

  return {
    tasks,
    tasksStatus,
    setTasksStatus
  };
}

export default useScheduler;
