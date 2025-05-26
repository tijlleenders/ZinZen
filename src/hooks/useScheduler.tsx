/* eslint-disable import/no-relative-packages */
import { useSetRecoilState } from "recoil";
import { useQuery, useMutation } from "react-query";

import { GoalItem } from "@src/models/GoalItem";
import { getAllGoals } from "@src/api/GoalsAPI";
import { ISchedulerInput, ISchedulerOutput, SchedulerCacheCode } from "@src/Interfaces/IScheduler";
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
      code: SchedulerCacheCode;
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

  const processSchedulerResult = async (
    res: ISchedulerOutput,
    newGeneratedInputId: string,
    cachedResCode: SchedulerCacheCode,
  ) => {
    try {
      await putSchedulerRes(cachedResCode, newGeneratedInputId, JSON.stringify(res));
      const processedOutput = await handleSchedulerOutput(res);
      return processedOutput;
    } catch (error) {
      setSchedulerError((prevErrors) => [...prevErrors, `Error processing scheduler result: ${error}`]);
      throw error;
    }
  };

  const {
    data: tasks,
    isLoading,
    error: queryError,
    refetch: generateInitialSchedule,
  } = useQuery({
    queryKey: ["scheduler"],
    queryFn: async () => {
      const { schedulerInput: schedulerInputV1, cachedRes } = await generateSchedule();
      let newGeneratedInputId = "";
      let res: ISchedulerOutput = { scheduled: [], impossible: [] };

      if (cachedRes.code === "found" && cachedRes.output) {
        res = cachedRes.output;
        logIO(JSON.stringify(schedulerInputV1), res);
      } else {
        const { generatedInputId, schedulerInput: schedulerInputV2 } = await generateSchedule();
        newGeneratedInputId = generatedInputId;
        await init();
        res = schedule(schedulerInputV2);
      }

      return processSchedulerResult(res, newGeneratedInputId, cachedRes.code);
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { mutateAsync: checkGoalScheduleMutation, isLoading: isCheckingGoalSchedule } = useMutation({
    mutationFn: async (goal: GoalItem): Promise<ISchedulerOutput | null> => {
      try {
        const activeGoals: GoalItem[] = await getAllGoals();
        const goalsWithConfig = [...activeGoals, goal];
        const { schedulerInput } = await organizeDataForInptPrep(goalsWithConfig);

        await init();
        return schedule(schedulerInput);
      } catch (err) {
        setSchedulerError((prevErrors) => [...prevErrors, `Error checking goal schedule: ${err}`]);
        return null;
      }
    },
  });

  return {
    tasks: tasks || {},
    isLoading,
    error: queryError,
    checkGoalSchedule: checkGoalScheduleMutation,
    isCheckingGoalSchedule,
    generateInitialSchedule,
  };
}

export default useScheduler;
