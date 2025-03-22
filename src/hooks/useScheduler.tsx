/* eslint-disable import/no-relative-packages */
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";

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
  const devMode = useRecoilValue(openDevMode);
  const [tasks, setTasks] = useState<{ [day: string]: ITaskOfDay }>({});
  const [action, setLastAction] = useRecoilState(lastAction);
  const setSchedulerError = useSetRecoilState(schedulerErrorState);

  const getInputForScheduler = async () => {
    const activeGoals: GoalItem[] = await getAllGoals();
    const { schedulerInput } = await organizeDataForInptPrep(activeGoals);
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
    try {
      const { schedulerInput: schedulerInputV1, cachedRes } = await generateSchedule();
      let newGeneratedInputId = "";
      let res: ISchedulerOutput | undefined = { scheduled: [], impossible: [] };

      console.log(
        "🚀 ~ file: useScheduler.tsx:58 ~ initialCall ~ JSON.stringify(schedulerInputV1), res:",
        JSON.stringify(schedulerInputV1),
        schedulerInputV1,
      );
      console.log("🚀 ~ file: useScheduler.tsx:75 ~ initialCall ~ cachedRes.code:", cachedRes.code);

      if (cachedRes.code === "found") {
        res = cachedRes.output;
        logIO(JSON.stringify(schedulerInputV1), res as ISchedulerOutput);
      } else {
        const { generatedInputId, schedulerInput: schedulerInputV2 } = await generateSchedule();
        newGeneratedInputId = generatedInputId;

        await init();
        res = schedule(schedulerInputV2);
      }

      await putSchedulerRes(cachedRes.code, newGeneratedInputId, JSON.stringify(res));
      console.log("schedule saved");

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
    if (action.includes("task")) {
      initialCall().then(async () => {
        setLastAction("none");
      });
    }
  }, [action]);

  const checkGoalSchedule = async (goal: GoalItem) => {
    try {
      const activeGoals: GoalItem[] = await getAllGoals();
      const goalsWithConfig = [...activeGoals, goal];

      const { schedulerInput } = await organizeDataForInptPrep(goalsWithConfig);

      await init();
      const res = schedule(schedulerInput);

      return res;
    } catch (error) {
      console.log("Error checking goal schedule:", error);
      return null;
    }
  };

  return {
    tasks,
    checkGoalSchedule,
  };
}

export default useScheduler;
