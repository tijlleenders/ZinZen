import { getDeletedGoals } from "@src/api/TrashAPI";
import { useQuery } from "react-query";

export const useGetDeletedGoals = (parentGoalId: string) => {
  const {
    data: deletedGoals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["deletedGoals", parentGoalId],
    queryFn: () => getDeletedGoals(parentGoalId),
  });
  return { deletedGoals, isLoading, error };
};
