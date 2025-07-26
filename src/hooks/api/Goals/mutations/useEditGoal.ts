import useGoalActions from "@src/hooks/useGoalActions";
import { GoalItem } from "@src/models/GoalItem";
import { ILocationState } from "@src/Interfaces";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import plingSound from "@assets/pling.mp3";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { hashObject } from "@src/utils";
import { getGoalHintItem } from "@src/api/HintsAPI";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetGoalById } from "../queries/useGetGoalById";

const editGoalSound = new Audio(plingSound);

type EditGoalMutation = {
  goal: GoalItem;
  hintOption: boolean;
};

export const useEditGoal = (activeGoalId: string, isModal = false) => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const [suggestedGoal, setSuggestedGoal] = useRecoilState(suggestedGoalState);
  const { updateGoal } = useGoalActions();
  const { data: activeGoal } = useGetGoalById(activeGoalId || "");
  const navigate = useNavigate();
  const location = useLocation();
  const { mutate: editGoalMutation, isLoading: isEditingGoal } = useMutation({
    mutationFn: async ({ goal, hintOption }: EditGoalMutation) => {
      const currentHintItem = await getGoalHintItem(goal.id);

      let hasGoalChanged =
        hashObject({ ...activeGoal }) !== hashObject(goal) || currentHintItem?.hintOptionEnabled !== hintOption;
      await updateGoal(goal, hintOption, activeGoal!);

      if (suggestedGoal) {
        console.log("here");
        await unarchiveUserGoal(suggestedGoal);
        navigate(`/goals/${suggestedGoal.parentGoalId === "root" ? "" : suggestedGoal.parentGoalId}`, {
          state: { ...location.state } as ILocationState,
          replace: true,
        });
        setSuggestedGoal(null);
        hasGoalChanged = true;
      }
      return hasGoalChanged;
    },
    mutationKey: ["goals"],
    onSuccess: async (hasGoalChanged: boolean) => {
      queryClient.invalidateQueries({
        queryKey: [["scheduler"], ["reminders"]],
      });

      if (hasGoalChanged && isModal) {
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
