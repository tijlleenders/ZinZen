import { getGoalsByIds } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

export const useGetGoalsByIds = (goalIds: string[]) => {
  const {
    data: goals,
    isLoading,
    error,
  } = useQuery({
    queryKey: GOAL_QUERY_KEYS.batch(goalIds),
    queryFn: () => getGoalsByIds(goalIds),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: 1,
    retryDelay: 100,
    enabled: goalIds.length > 0,
  });

  return { goals: goals || [], isLoading, error };
};
