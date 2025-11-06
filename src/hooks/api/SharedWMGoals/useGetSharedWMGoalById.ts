import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { SHARED_WM_GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import { GoalItem } from "@src/models/GoalItem";
import { QueryResult } from "@src/hooks/types";

export const useGetSharedWMGoalById = (id: string): QueryResult<GoalItem> => {
  const { data, isLoading } = useQuery({
    queryKey: SHARED_WM_GOAL_QUERY_KEYS.detail(id),
    queryFn: () => getSharedWMGoalById(id),
  });

  return { data, isLoading };
};
