import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { GoalItem } from "@src/models/GoalItem";
import { GOAL_QUERY_KEYS, HINT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { addHintGoaltoMyGoals } from "@src/api/GoalsAPI";

export const useAddGoalHintsToMyGoal = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const { mutate: addGoalHintToMyGoal, isLoading: isAddingGoalHintToMyGoal } = useMutation({
    mutationFn: (goal: GoalItem) => addHintGoaltoMyGoals(goal),
    mutationKey: HINT_QUERY_KEYS.all,
    onSuccess: () => {
      queryClient.invalidateQueries(HINT_QUERY_KEYS.all);
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.all);
      setShowToast({ open: true, message: "Goal hint added to my goals", extra: "" });
      window.history.back();
    },
    onError: () => {
      setShowToast({ open: true, message: "Failed to add goal hint to my goals", extra: "" });
    },
  });

  return { addGoalHintToMyGoal, isAddingGoalHintToMyGoal };
};
