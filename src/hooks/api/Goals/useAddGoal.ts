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

    onSuccess: (_, { newGoal }) => {
      queryClient.invalidateQueries({ queryKey: ["scheduler", "reminders"] });
      setLastAction(GoalActions.GOAL_ITEM_CREATED);
      addGoalSound.play();
      setShowToast({
        open: true,
        message: `${newGoal.title.slice(0, 15)}${newGoal.title.length > 15 ? "..." : ""} created!`,
        extra: "",
      });
    },
    onError: (error) => {
      console.error(error);
      setShowToast({
        open: true,
        message: "Goal cannot be added without title",
        extra: "",
      });
    },
  });

  return { addGoalMutation, isAddingGoal };
};
