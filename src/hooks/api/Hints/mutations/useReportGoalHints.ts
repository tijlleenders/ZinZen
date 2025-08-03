import { reportHint } from "@src/api";
import { deleteAvailableGoalHint } from "@src/api/HintsAPI";
import { GOAL_QUERY_KEYS, HINT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { GoalItem } from "@src/models/GoalItem";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

export const useReportGoalHints = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const { mutate: reportGoalHint, isLoading: isReportingGoalHint } = useMutation({
    mutationFn: (goal: GoalItem) => reportHint(goal),
    mutationKey: HINT_QUERY_KEYS.all,
    onSuccess: async (res, goal) => {
      queryClient.invalidateQueries([HINT_QUERY_KEYS.all, GOAL_QUERY_KEYS.all]);
      await deleteAvailableGoalHint(goal.parentGoalId, goal.id);
      setShowToast({ open: true, message: res.message, extra: "" });
      window.history.back();
    },
    onError: () => {
      setShowToast({ open: true, message: "Failed to report goal hint", extra: "" });
    },
  });

  return { reportGoalHint, isReportingGoalHint };
};
