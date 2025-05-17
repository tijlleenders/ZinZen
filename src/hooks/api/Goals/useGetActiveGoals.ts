import { getActiveGoals } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";

export const useGetActiveGoals = (parentGoalId: string) => {
  const {
    data: activeGoals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activeGoals", parentGoalId],
    queryFn: () => getActiveGoals(parentGoalId),
  });
  return { activeGoals, isLoading, error };
};
