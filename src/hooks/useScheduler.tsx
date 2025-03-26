/* eslint-disable import/no-relative-packages */
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useEffect, useState } from "react";

import { GoalItem } from "@src/models/GoalItem";
import { ITaskOfDay } from "@src/Interfaces/Task";
import { getAllGoals } from "@src/api/GoalsAPI";
import { ISchedulerInput, ISchedulerOutput } from "@src/Interfaces/IScheduler";
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

  const getInputForScheduler = async (activeGoals: GoalItem[]) => {
    try {
      const { schedulerInput } = await organizeDataForInptPrep(activeGoals);
      return schedulerInput;
    } catch (error) {
      setSchedulerError((prevErrors) => [...prevErrors, `Error preparing scheduler input: ${error}`]);
      throw error;
    }
  };

  interface ScheduleResult {
    generatedInputId: string;
    schedulerInput: ISchedulerInput;
    cachedRes: {
      code: string;
      output?: ISchedulerOutput;
    };
  }

  const generateSchedule = async (): Promise<ScheduleResult> => {
    try {
      const activeGoals: GoalItem[] = await getAllGoals();
      const schedulerInput = await getInputForScheduler(activeGoals);
      const generatedInputId = generateUniqueIdForSchInput(JSON.stringify(schedulerInput));
      const cachedRes = await getCachedSchedule(generatedInputId);

      console.log("cachedRes", cachedRes);
      return { generatedInputId, schedulerInput, cachedRes };
    } catch (error) {
      setSchedulerError((prevErrors) => [...prevErrors, `Error generating schedule: ${error}`]);
      throw error;
    }
  };

  const logIO = (schedulerInput: string, schedulerOutput: ISchedulerOutput) => {
    try {
      const parsedInput = JSON.parse(schedulerInput);
      console.group("Scheduler IO Debug");
      console.log("Parsed Input:", parsedInput);
      console.log("Raw Input:", schedulerInput);
      console.log("Output:", schedulerOutput);
      console.log("Stringified Output:", JSON.stringify(schedulerOutput));
      console.groupEnd();
    } catch (error) {
      console.error("Error logging scheduler IO:", error);
    }
  };

  const processSchedulerResult = async (res: ISchedulerOutput, newGeneratedInputId: string) => {
    try {
      await putSchedulerRes("not_found", newGeneratedInputId, JSON.stringify(res));
      const processedOutput = await handleSchedulerOutput(res);
      setTasks({ ...processedOutput });
    } catch (error) {
      setSchedulerError((prevErrors) => [...prevErrors, `Error processing scheduler result: ${error}`]);
      throw error;
    }
  };

  const initialCall = async () => {
    try {
      const { schedulerInput: schedulerInputV1, cachedRes } = await generateSchedule();
      let newGeneratedInputId = "";
      let res: ISchedulerOutput = { scheduled: [], impossible: [] };

      if (cachedRes.code === "found" && cachedRes.output) {
        res = cachedRes.output;
        console.log("here");
        logIO(JSON.stringify(schedulerInputV1), res);
      } else {
        const { generatedInputId, schedulerInput: schedulerInputV2 } = await generateSchedule();
        newGeneratedInputId = generatedInputId;

        await init();
        res = schedule(schedulerInputV2);
      }

      await processSchedulerResult(res, newGeneratedInputId);
    } catch (error) {
      setSchedulerError((prevErrors) => [...prevErrors, `Error in initial call: ${error}`]);
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

  const checkGoalSchedule = async (goal: GoalItem): Promise<ISchedulerOutput | null> => {
    try {
      const activeGoals: GoalItem[] = await getAllGoals();
      const goalsWithConfig = [...activeGoals, goal];
      const { schedulerInput } = await organizeDataForInptPrep(goalsWithConfig);

      await init();
      return schedule(schedulerInput);
    } catch (error) {
      setSchedulerError((prevErrors) => [...prevErrors, `Error checking goal schedule: ${error}`]);
      return null;
    }
  };

  return {
    tasks,
    checkGoalSchedule,
  };
}

export default useScheduler;
