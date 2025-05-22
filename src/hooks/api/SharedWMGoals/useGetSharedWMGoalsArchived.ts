import { getArchivedSharedWMGoals } from "@src/api/SharedWMAPI";
import { SHARED_WM_GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";

export const useGetSharedWMGoalsArchived = (parentGoalId: string, relId: string) => {
  const { partnerId } = useParams();

  const {
    data: archivedSharedWMGoals,
    isLoading,
    isError,
  } = useQuery({
    queryKey: SHARED_WM_GOAL_QUERY_KEYS.list("archived", parentGoalId),
    queryFn: () => getArchivedSharedWMGoals(parentGoalId, relId),
    enabled: !!partnerId,
  });

  return { data: archivedSharedWMGoals, isLoading, isError };
};
