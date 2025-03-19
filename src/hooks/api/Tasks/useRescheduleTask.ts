import { addTaskPostponedEvent } from "@src/api/TaskHistoryAPI";
import { displayToast, lastAction } from "@src/store";
import { displayReschedule } from "@src/store/TaskState";
import { useMutation } from "react-query";
import { useSetRecoilState } from "recoil";
import { blockedSlotOfTask } from "@src/models/TaskItem";
import { addBlockedSlot } from "@src/api/TasksAPI";
import { TaskActions } from "@src/constants/actions";
import { ITask } from "@src/Interfaces/Task";
import rescheduleTune from "@assets/reschedule.mp3";

const rescheduleSound = new Audio(rescheduleTune);

export const useRescheduleTask = (task: ITask) => {
  const setShowToast = useSetRecoilState(displayToast);
  const setDisplayReschedule = useSetRecoilState(displayReschedule);
  const setLastAction = useSetRecoilState(lastAction);

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
      setLastAction(TaskActions.TASK_RESCHEUDLED);
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
