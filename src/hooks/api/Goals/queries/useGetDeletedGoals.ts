import { getDeletedGoals } from "@src/api/TrashAPI";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import { TrashItem } from "@src/models/TrashItem";
import { QueryResult } from "@src/hooks/types";

export const useGetDeletedGoals = (parentGoalId: string): QueryResult<TrashItem[]> => {
  const { data, isLoading } = useQuery({
    queryKey: GOAL_QUERY_KEYS.list("deleted", parentGoalId),
    queryFn: () => getDeletedGoals(parentGoalId),
    refetchOnWindowFocus: false,
    enabled: !!parentGoalId,
  });
  return { data, isLoading };
};
