import { deleteAvailableGoalHint } from "@src/api/HintsAPI";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import plingSound from "@assets/pling.mp3";
import { HINT_QUERY_KEYS } from "@src/factories/queryKeyFactory";

export const useDeleteGoalHint = () => {
  const restoreGoalSound = new Audio(plingSound);
  const queryClient = useQueryClient();

  const { parentId = "", activeGoalId: goalId = "" } = useParams();
  const setShowToast = useSetRecoilState(displayToast);
  const { mutate: deleteGoalHint, isLoading: isDeletingGoalHint } = useMutation({
    mutationKey: ["goals"],
    mutationFn: () => deleteAvailableGoalHint(parentId, goalId),
    onSuccess: () => {
      queryClient.invalidateQueries(HINT_QUERY_KEYS.all);
      restoreGoalSound.play();
      window.history.back();
      setShowToast({ open: true, message: "Goal hint deleted successfully", extra: "" });
    },
    onError: () => {
      setShowToast({ open: true, message: "Failed to delete goal hint", extra: "" });
    },
  });

  return { deleteGoalHint, isDeletingGoalHint };
};
