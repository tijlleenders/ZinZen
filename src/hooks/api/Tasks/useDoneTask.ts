import { addTaskCompletedEvent } from "@src/api/TaskHistoryAPI";
import { ITask } from "@src/Interfaces/Task";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { displayToast } from "@src/store";
import archiveTune from "@assets/archive.mp3";

const doneSound = new Audio(archiveTune);

export const useDoneTask = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const {
    mutate: doneTaskMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (task: ITask) => addTaskCompletedEvent(task),
    onSuccess: async () => {
      await doneSound.play();
      queryClient.invalidateQueries({ queryKey: ["scheduler", "reminders"] });
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
