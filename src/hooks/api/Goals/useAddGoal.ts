import { GoalItem } from "@src/models/GoalItem";
import { displayToast, lastAction } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import plingSound from "@assets/pling.mp3";
import useGoalActions from "@src/hooks/useGoalActions";
import { GoalActions } from "@src/constants/actions";

const addGoalSound = new Audio(plingSound);

type AddGoalMutation = {
  newGoal: GoalItem;
  hintOption: boolean;
  parentGoal?: GoalItem;
};

export const useAddGoal = () => {
  const queryClient = useQueryClient();
  const setShowToast = useSetRecoilState(displayToast);
  const setLastAction = useSetRecoilState(lastAction);
  const { addGoal } = useGoalActions();

  const { mutate: addGoalMutation, isLoading: isAddingGoal } = useMutation({
    mutationFn: ({ newGoal, hintOption, parentGoal }: AddGoalMutation) => addGoal(newGoal, hintOption, parentGoal),

    onMutate: async ({ newGoal }) => {
      await queryClient.cancelQueries({ queryKey: ["activeGoals", newGoal.parentGoalId] });

      const previousGoals = queryClient.getQueryData(["activeGoals", newGoal.parentGoalId]);

      queryClient.setQueryData(["activeGoals", newGoal.parentGoalId], (old: GoalItem[] = []) => {
        return [newGoal, ...old];
      });

      return { previousGoals };
    },

    onError: (error, { newGoal }, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(["activeGoals", newGoal.parentGoalId], context.previousGoals);
      }
      console.error(error);
      setShowToast({
        open: true,
        message: "Goal cannot be added without title",
        extra: "",
      });
    },

    onSettled: (_, __, { newGoal }) => {
      queryClient.invalidateQueries({ queryKey: ["activeGoals", newGoal.parentGoalId] });
    },

    onSuccess: (_, { newGoal }) => {
      queryClient.invalidateQueries({ queryKey: ["scheduler", "reminders"] });
      setLastAction(GoalActions.GOAL_ITEM_CREATED);
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
