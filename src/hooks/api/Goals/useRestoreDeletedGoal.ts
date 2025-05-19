import { useMutation } from "react-query";
import { displayToast } from "@src/store";

import plingSound from "@assets/pling.mp3";
import { restoreUserGoal } from "@src/api/TrashAPI";
import { GoalItem } from "@src/models/GoalItem";
import { useSetRecoilState } from "recoil";

const restoreGoalSound = new Audio(plingSound);

export const useRestoreDeletedGoal = () => {
  const setShowToast = useSetRecoilState(displayToast);

  const { mutate: restoreDeletedGoalMutation, isLoading } = useMutation({
    mutationFn: ({ goal }: { goal: GoalItem }) => {
      return restoreUserGoal(goal, goal.typeOfGoal === "shared");
    },
    mutationKey: ["goals"],
    onSuccess: () => {
      setShowToast({
        open: true,
        message: "Deleted goal restored successfully",
        extra: "",
      });
      restoreGoalSound.play();
    },
    onError: () => {
      setShowToast({
        open: true,
        message: "Failed to restore deleted goal",
        extra: "",
      });
    },
  });

  return { restoreDeletedGoalMutation, isLoading };
};
