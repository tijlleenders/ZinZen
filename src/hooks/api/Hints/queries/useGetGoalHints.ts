import { getGoalHintItem } from "@src/api/HintsAPI";
import { HINT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { GoalItem } from "@src/models/GoalItem";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const useGetGoalHints = () => {
  const { parentId = "" } = useParams();
  const {
    data: hints,
    isLoading,
    error,
  } = useQuery({
    queryKey: HINT_QUERY_KEYS.all,
    queryFn: async () => {
      const array: GoalItem[] = [];
      const hintItem = await getGoalHintItem(parentId);
      hintItem?.availableGoalHints?.forEach((availableGoalHint) => {
        if (availableGoalHint) {
          array.push(createGoalObjectFromTags({ ...availableGoalHint, parentGoalId: parentId }));
        }
      });
      return array;
    },
  });

  return { hints, isLoading, error };
};
