import { getGoalById } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";

export const useGetGoalById = (goalId: string) => {
  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ["goal", goalId],
    queryFn: () => getGoalById(goalId),
    enabled: !!goalId,
  });

  return { data, isLoading, isError, isSuccess };
};
