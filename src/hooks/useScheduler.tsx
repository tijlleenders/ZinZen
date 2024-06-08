/* eslint-disable import/no-relative-packages */
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";

import rescheduleTune from "@assets/reschedule.mp3";

import { TaskItem } from "@src/models/TaskItem";
import { GoalItem } from "@src/models/GoalItem";
import { ITaskOfDay } from "@src/Interfaces/Task";
import { getAllGoals } from "@src/api/GoalsAPI";
import { ISchedulerOutput } from "@src/Interfaces/IScheduler";
// import { resetProgressOfToday } from "@src/api/TasksAPI";
import { lastAction, openDevMode } from "@src/store";
import { generateUniqueIdForSchInput } from "@src/utils/SchedulerUtils";
import {
  getCachedSchedule,
  handleSchedulerOutput,
  organizeDataForInptPrep,
  putSchedulerRes,
} from "@src/helpers/MyTimeHelper";

import { schedulerErrorState } from "@src/store/SchedulerErrorState";
import init, { schedule } from "../../pkg/scheduler";

function useScheduler() {
  const rescheduleSound = new Audio(rescheduleTune);

  const [tasksStatus, setTasksStatus] = useState<{ [goalId: string]: TaskItem }>({});
  const devMode = useRecoilValue(openDevMode);
  const [tasks, setTasks] = useState<{ [day: string]: ITaskOfDay }>({});
  const [action, setLastAction] = useRecoilState(lastAction);
  const setSchedulerError = useSetRecoilState(schedulerErrorState);

  const getInputForScheduler = async () => {
    const activeGoals: GoalItem[] = await getAllGoals();
    const { dbTasks, schedulerInput } = await organizeDataForInptPrep(activeGoals);
    setTasksStatus({ ...dbTasks });
    return schedulerInput;
  };

  const generateSchedule = async () => {
    const schedulerInput = await getInputForScheduler();
    const generatedInputId: string | undefined = generateUniqueIdForSchInput(JSON.stringify(schedulerInput));
    const cachedRes = await getCachedSchedule(generatedInputId);
    return { generatedInputId, schedulerInput, cachedRes };
  };

  const logIO = (schedulerInput: string, schedulerOutput: ISchedulerOutput) => {
    console.log("parsedInput", JSON.parse(schedulerInput));
    console.log("input", schedulerInput);
    console.log("output", schedulerOutput, JSON.stringify(schedulerOutput));
  };

  const initialCall = async () => {
    const { schedulerInput: schedulerInputV1, cachedRes } = await generateSchedule();
    let newGeneratedInputId = "";
    let res: ISchedulerOutput;
    console.log(
      "🚀 ~ file: useScheduler.tsx:58 ~ initialCall ~ JSON.stringify(schedulerInputV1), res:",
      JSON.stringify(schedulerInputV1),
      schedulerInputV1,
    );
    console.log("🚀 ~ file: useScheduler.tsx:75 ~ initialCall ~ cachedRes.code:", cachedRes.code);
    if (cachedRes.code === "found") {
      res = cachedRes.output;
      logIO(JSON.stringify(schedulerInputV1), res);
    } else {
      // await resetProgressOfToday();
      const { generatedInputId, schedulerInput: schedulerInputV2 } = await generateSchedule();
      newGeneratedInputId = generatedInputId;

      try {
        await init();
        res = schedule(schedulerInputV2);
      } catch (error) {
        setSchedulerError((prevErrors) => [...prevErrors, error.toString()]);
      }
    }

    try {
      await putSchedulerRes(cachedRes.code, newGeneratedInputId, JSON.stringify(res));
      console.log("schedule saved");
    } catch (error) {
      setSchedulerError((prevErrors) => [...prevErrors, error.toString()]);
    }

    try {
      const processedOutput = await handleSchedulerOutput(res);
      setTasks({ ...processedOutput });
    } catch (error) {
      setSchedulerError((prevErrors) => [...prevErrors, error.toString()]);
    }
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
    setTasksStatus,
  };
}

export default useScheduler;
