import { moveGoalHierarchy } from "@src/controllers/GoalController";
import { useMutation } from "react-query";
import { useSetRecoilState } from "recoil";
import { displayToast, lastAction } from "@store";
import { moveGoalState } from "@src/store/moveGoalState";

type MoveGoalParams = {
  goalId: string;
  newParentGoalId: string;
};

export const useGoalMoveMutation = () => {
  const setToastMessage = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
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
    onSuccess: () => {
      setToastMessage({ open: true, message: "Goal moved successfully", extra: "" });
      setLastAction("goalMoved");
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
