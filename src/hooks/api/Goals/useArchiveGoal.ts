import { archiveUserGoal, updateTimestamp } from "@src/api/GoalsAPI";
import { sendFinalUpdateOnGoal } from "@src/controllers/PubSubController";
import archiveTune from "@assets/archive.mp3";
import { GoalItem } from "@src/models/GoalItem";
import { displayToast } from "@src/store";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";

type ArchiveGoalParams = {
  goal: GoalItem;
  ancestors: string[];
};

const doneSound = new Audio(archiveTune);

export const useArchiveGoal = () => {
  const setShowToast = useSetRecoilState(displayToast);
  const queryClient = useQueryClient();

  const { mutate: archiveGoalMutation, isLoading } = useMutation<void, Error, ArchiveGoalParams>({
    mutationFn: ({ goal, ancestors }: ArchiveGoalParams) => {
      sendFinalUpdateOnGoal(goal.id, "archived", ancestors, false).then(() => {
        console.log("Update Sent");
      });
      return archiveUserGoal(goal);
    },
    onSuccess: async (_, { goal }) => {
      queryClient.invalidateQueries({ queryKey: ["reminders"] });
      await updateTimestamp(goal.id);
      await doneSound.play();
    },
    onError: (error: Error) => {
      console.error(error);
      setShowToast({
        open: true,
        message: "Failed to archive goal",
        extra: "",
      });
    },
  });

  return { archiveGoalMutation, isLoading };
};
