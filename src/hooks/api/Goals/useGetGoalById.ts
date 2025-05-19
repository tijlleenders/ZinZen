import { getGoalById } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

export const useGetGoalById = (goalId: string) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: GOAL_QUERY_KEYS.detail(goalId),
    queryFn: () => getGoalById(goalId),
    enabled: !!goalId,
  });

  return { data, isLoading, isError, isSuccess };
};
