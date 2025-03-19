import { addTaskCompletedEvent } from "@src/api/TaskHistoryAPI";
import { ITask } from "@src/Interfaces/Task";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { displayToast } from "@src/store";
import archiveTune from "@assets/archive.mp3";

const doneSound = new Audio(archiveTune);

export const useDoneTask = () => {
  const setShowToast = useSetRecoilState(displayToast);
  const queryClient = useQueryClient();
  const {
    mutate: doneTaskMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (task: ITask) => addTaskCompletedEvent(task),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tasksToMarkDone"] });
      await doneSound.play();
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
