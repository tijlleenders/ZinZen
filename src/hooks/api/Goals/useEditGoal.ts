import useGoalActions from "@src/hooks/useGoalActions";
import { GoalItem } from "@src/models/GoalItem";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilValue, useSetRecoilState } from "recoil";
import plingSound from "@assets/pling.mp3";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { hashObject } from "@src/utils";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { useParams } from "react-router-dom";
import { useGetGoalById } from "./useGetGoalById";

const editGoalSound = new Audio(plingSound);

type EditGoalMutation = {
  goal: GoalItem;
  hintOption: boolean;
};

export const useEditGoal = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const suggestedGoal = useRecoilValue(suggestedGoalState);
  const { updateGoal } = useGoalActions();
  const { activeGoalId } = useParams();
  const { data: activeGoal } = useGetGoalById(activeGoalId || "");

  const { mutate: editGoalMutation, isLoading: isEditingGoal } = useMutation({
    mutationFn: async ({ goal, hintOption }: EditGoalMutation) => {
      const currentHintItem = await getGoalHintItem(goal.id);

      const hasGoalChanged =
        hashObject({ ...activeGoal }) !== hashObject(goal) || currentHintItem?.hintOptionEnabled !== hintOption;

      await updateGoal(goal, hintOption);
      return hasGoalChanged;
    },
    mutationKey: ["goals"],
    onSuccess: (hasGoalChanged) => {
      queryClient.invalidateQueries({
        queryKey: [["scheduler"], ["reminders"]],
      });

      if (hasGoalChanged) {
        setShowToast({
          open: true,
          message: suggestedGoal ? "Goal (re)created!" : "Goal updated!",
          extra: "",
        });

        editGoalSound.play();
      }
    },

    onError: (error: Error) => {
      console.error("Failed to update goal:", error);
      setShowToast({
        open: true,
        message: "Failed to update goal. Please try again.",
        extra: "",
      });
    },
  });

  return { editGoalMutation, isEditingGoal };
};
