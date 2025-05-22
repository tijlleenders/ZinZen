import { convertSharedWMGoalToColab } from "@src/api/SharedWMAPI";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { displayToast } from "@store";
import { GOAL_QUERY_KEYS, SHARED_WM_GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

export const useConvertToNormalGoal = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const { mutate: convertToNormalGoal, isLoading } = useMutation({
    mutationFn: convertSharedWMGoalToColab,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: SHARED_WM_GOAL_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: GOAL_QUERY_KEYS.all });
      if (res) {
        setShowToast({
          open: true,
          message: `Goal ${res.convertedGoal?.title} has been added into ${res.parentGoalName}!`,
          extra: "",
        });
      }
    },
  });

  return { convertToNormalGoal, isLoading };
};
