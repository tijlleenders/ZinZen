import { getArchivedGoals } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";

export const useGetArchivedGoals = (parentGoalId: string) => {
  const {
    data: archivedGoals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["archivedGoals", parentGoalId],
    queryFn: () => getArchivedGoals(parentGoalId),
  });
  return { archivedGoals, isLoading, error };
};
