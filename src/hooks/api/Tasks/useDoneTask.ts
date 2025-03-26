import { addTaskCompletedEvent } from "@src/api/TaskHistoryAPI";
import { ITask } from "@src/Interfaces/Task";
import { useMutation } from "react-query";
import { useSetRecoilState } from "recoil";
import { displayToast, lastAction } from "@src/store";
import archiveTune from "@assets/archive.mp3";
import { TaskActions } from "@src/constants/actions";

const doneSound = new Audio(archiveTune);

export const useDoneTask = () => {
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const {
    mutate: doneTaskMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (task: ITask) => addTaskCompletedEvent(task),
    onSuccess: async () => {
      await doneSound.play();
      setLastAction(TaskActions.TASK_COMPLETED);
    },
    onError: (err) => {
      setShowToast({
        open: true,
        message: "Error completing task",
        extra: "",
      });
      console.error(err);
    },
  });

  return { doneTaskMutation, isLoading, isError, error };
};
