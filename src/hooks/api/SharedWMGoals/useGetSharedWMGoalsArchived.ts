import { getArchivedSharedWMGoals } from "@src/api/SharedWMAPI";
import { SHARED_WM_GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import { useParams } from "@tanstack/react-router";
import { GoalItem } from "@src/models/GoalItem";
import { QueryResult } from "@src/hooks/types";

export const useGetSharedWMGoalsArchived = (parentGoalId: string, relId: string): QueryResult<GoalItem[]> => {
  const { partnerId } = useParams({ strict: false });

  const { data, isLoading } = useQuery({
    queryKey: SHARED_WM_GOAL_QUERY_KEYS.list("archived", parentGoalId),
    queryFn: () => getArchivedSharedWMGoals(parentGoalId, relId),
    enabled: !!partnerId,
  });

  return { data, isLoading };
};
