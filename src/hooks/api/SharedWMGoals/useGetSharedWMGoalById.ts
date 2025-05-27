import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { SHARED_WM_GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";

export const useGetSharedWMGoalById = (id: string) => {
  const {
    data: sharedWMGoal,
    isLoading,
    error,
  } = useQuery({
    queryKey: SHARED_WM_GOAL_QUERY_KEYS.detail(id),
    queryFn: () => getSharedWMGoalById(id),
  });

  return { sharedWMGoal, isLoading, error };
};
