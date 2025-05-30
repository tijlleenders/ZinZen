import { GoalItem } from "@src/models/GoalItem";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import plingSound from "@assets/pling.mp3";
import useGoalActions from "@src/hooks/useGoalActions";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

const addGoalSound = new Audio(plingSound);

type AddGoalMutation = {
  newGoal: GoalItem;
  hintOption: boolean;
  parentGoal?: GoalItem;
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const { addGoal } = useGoalActions();

  const { mutate: addGoalMutation, isLoading: isAddingGoal } = useMutation({
    mutationFn: ({ newGoal, hintOption, parentGoal }: AddGoalMutation) => {
      return addGoal(newGoal, hintOption, parentGoal);
    },

    onMutate: async ({ newGoal }) => {
      await queryClient.cancelQueries({ queryKey: GOAL_QUERY_KEYS.list("active", newGoal.parentGoalId) });
      const previousGoals = queryClient.getQueryData(GOAL_QUERY_KEYS.list("active", newGoal.parentGoalId));
      queryClient.setQueryData(GOAL_QUERY_KEYS.list("active", newGoal.parentGoalId), (old: GoalItem[] = []) => {
        return [newGoal, ...old];
      });
      return { previousGoals };
    },

    mutationKey: ["goals", "add"],

    onError: (error, { newGoal }, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(GOAL_QUERY_KEYS.list("active", newGoal.parentGoalId), context.previousGoals);
      }
      console.error(error);
      setShowToast({
        open: true,
        message: "Goal cannot be added without title",
        extra: "",
      });
    },

    onSettled: (_, __, { newGoal }) => {
      queryClient.invalidateQueries(GOAL_QUERY_KEYS.list("active", newGoal.parentGoalId));
    },

    onSuccess: (_, { newGoal }) => {
      queryClient.invalidateQueries({ queryKey: ["scheduler", "reminders"] });
      setShowToast({
        open: true,
        message: `${newGoal.title.slice(0, 15)}${newGoal.title.length > 15 ? "..." : ""} created!`,
        extra: "",
      });
      addGoalSound.play();
    },
  });

  return { addGoalMutation, isAddingGoal };
};
