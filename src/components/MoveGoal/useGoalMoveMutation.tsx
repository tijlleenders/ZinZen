import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { displayToast } from "@store";
import { moveGoalState } from "@src/store/moveGoalState";
import { moveGoalHierarchy } from "./MoveGoalHelper";

type MoveGoalParams = {
  goalId: string;
  newParentGoalId: string;
};

export const useGoalMoveMutation = () => {
  const queryClient = useQueryClient();
  const setToastMessage = useSetRecoilState(displayToast);
  const setGoalToMove = useSetRecoilState(moveGoalState);
  const {
    mutate: moveGoalMutation,
    isLoading,
    isError,
    error,
  } = useMutation<void, Error, MoveGoalParams>({
    mutationFn: async ({ goalId, newParentGoalId }) => {
      await moveGoalHierarchy(goalId, newParentGoalId);
    },
    onSuccess: (_, data) => {
      setToastMessage({ open: true, message: "Goal moved successfully", extra: "" });
      queryClient.invalidateQueries({ queryKey: ["activeGoals", data.newParentGoalId] });
    },
    onError: () => {
      setToastMessage({ open: true, message: "Error moving goal", extra: "" });
    },
    onSettled: () => {
      setGoalToMove(null);
      window.history.back();
    },
  });

  return { moveGoalMutation, isLoading, isError, error };
};
