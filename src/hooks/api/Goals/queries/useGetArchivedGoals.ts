import { getArchivedGoals } from "@src/api/GoalsAPI";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import { GoalItem } from "@src/models/GoalItem";
import { QueryResult } from "@src/hooks/types";

export const useGetArchivedGoals = (parentGoalId: string): QueryResult<GoalItem[]> => {
  const { data, isLoading } = useQuery({
    queryKey: GOAL_QUERY_KEYS.list("archived", parentGoalId),
    queryFn: () => {
      return getArchivedGoals(parentGoalId);
    },
  });
  return { data, isLoading };
};
