import { addTaskSkippedEvent } from "@src/api/TaskHistoryAPI";
import { ITask } from "@src/Interfaces/Task";
import { useMutation } from "react-query";
import forgetTune from "@assets/forget.mp3";
import { useSetRecoilState } from "recoil";
import { displayToast, lastAction } from "@src/store";
import { displayReschedule } from "@src/store/TaskState";
import { TaskActions } from "@src/constants/actions";

const forgetSound = new Audio(forgetTune);

export const useSkipTask = () => {
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const setDisplayReschedule = useSetRecoilState(displayReschedule);

  const {
    mutate: skipTaskMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (task: ITask) => addTaskSkippedEvent(task),
    onSuccess: async () => {
      await forgetSound.play();
      setDisplayReschedule(null);
      setShowToast({
        open: true,
        message: "Task skipped successfully",
        extra: "",
      });
      setLastAction(TaskActions.TASK_SKIPPED);
    },
    onError: (err) => {
      console.error(err);
      setDisplayReschedule(null);
      setShowToast({
        open: true,
        message: "Error skipping task",
        extra: "",
      });
    },
  });

  return { skipTaskMutation, isLoading, isError, error };
};
