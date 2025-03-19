import { addTaskSkippedEvent } from "@src/api/TaskHistoryAPI";
import { ITask } from "@src/Interfaces/Task";
import { useMutation, useQueryClient } from "react-query";
import forgetTune from "@assets/forget.mp3";
import { useSetRecoilState } from "recoil";
import { displayToast } from "@src/store";
import { displayReschedule } from "@src/store/TaskState";

const forgetSound = new Audio(forgetTune);

export const useSkipTask = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);

  const setDisplayReschedule = useSetRecoilState(displayReschedule);

  const {
    mutate: skipTaskMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (task: ITask) => addTaskSkippedEvent(task),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ["tasksToMarkDone"] });
      await forgetSound.play();
      setDisplayReschedule(null);
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
