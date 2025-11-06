import { addTaskPostponedEvent } from "@src/api/TaskHistoryAPI";
import { displayToast } from "@src/store";
import { displayReschedule } from "@src/store/TaskState";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { blockedSlotOfTask } from "@src/models/TaskItem";
import { addBlockedSlot } from "@src/api/TasksAPI";
import { ITask } from "@src/Interfaces/Task";
import rescheduleTune from "@assets/reschedule.mp3";

const rescheduleSound = new Audio(rescheduleTune);

export const useRescheduleTask = (task: ITask) => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const setDisplayReschedule = useSetRecoilState(displayReschedule);

  const {
    mutate: rescheduleTaskMutation,
    isLoading,
    isError,
    error,
  } = useMutation({
    mutationFn: (slot: blockedSlotOfTask) => {
      return addBlockedSlot(task.goalid, slot);
    },
    onSuccess: () => {
      addTaskPostponedEvent(task);
      setDisplayReschedule(null);
      queryClient.invalidateQueries({ queryKey: ["scheduler", "reminders"] });
      rescheduleSound.play();
    },
    onError: (err) => {
      console.error(err);
      setDisplayReschedule(null);
      setShowToast({ open: true, message: "Error rescheduling task", extra: "" });
    },
  });

  return { rescheduleTaskMutation, isLoading, isError, error };
};
