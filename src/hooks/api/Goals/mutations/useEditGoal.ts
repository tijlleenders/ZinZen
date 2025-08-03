import useGoalActions from "@src/hooks/useGoalActions";
import { GoalItem } from "@src/models/GoalItem";
import { ILocationState } from "@src/Interfaces";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState, useSetRecoilState } from "recoil";
import plingSound from "@assets/pling.mp3";
import { suggestedGoalState } from "@src/store/SuggestedGoalState";
import { hashObject } from "@src/utils";
import { unarchiveUserGoal } from "@src/api/GoalsAPI";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetGoalById } from "../queries/useGetGoalById";

const editGoalSound = new Audio(plingSound);

type EditGoalMutation = {
  goal: GoalItem;
  hintOption: boolean;
};

function hasGoalChangedFn(goalA: GoalItem | undefined, goalB: GoalItem): boolean {
  return (
    hashObject({
      ...goalA,
      hints: { ...goalA?.hints, availableGoalHints: [], lastCheckedDate: "", nextCheckDate: "" },
    }) !==
    hashObject({
      ...goalB,
      hints: { ...goalB.hints, availableGoalHints: [], lastCheckedDate: "", nextCheckDate: "" },
    })
  );
}

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
      const hasGoalChanged = hasGoalChangedFn(activeGoal, goal);
      if (hasGoalChanged) {
        await updateGoal(goal, hintOption, activeGoal!);
        if (suggestedGoal) {
          await unarchiveUserGoal(suggestedGoal);
          navigate(`/goals/${suggestedGoal.parentGoalId === "root" ? "" : suggestedGoal.parentGoalId}`, {
            state: { ...location.state } as ILocationState,
            replace: true,
          });
          setSuggestedGoal(null);
        }
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
