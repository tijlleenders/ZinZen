import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { useMutation, useQueryClient } from "react-query";

import plingSound from "@assets/pling.mp3";
import { displayToast } from "@src/store";
import { useSetRecoilState } from "recoil";

const restoreGoalSound = new Audio(plingSound);

export const useRestoreArchivedGoal = () => {
  const setShowToast = useSetRecoilState(displayToast);
  const queryClient = useQueryClient();

  const { mutate, isLoading } = useMutation({
    mutationFn: ({ goal }: { goal: GoalItem }) => unarchiveUserGoal(goal),
    mutationKey: ["goals"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scheduler", "reminders"] });
      restoreGoalSound.play();
    },
    onError: () => {
      setShowToast({
        open: true,
        message: "Failed to restore archived goal",
        extra: "",
      });
    },
  });

  return { mutate, isLoading };
};
