import { getActiveSharedWMGoals } from "@src/api/SharedWMAPI";
import { useQuery } from "react-query";

export const useGetSharedWMActiveGoals = (parentGoalId: string, relId?: string) => {
  const {
    data: activeSharedWMGoals,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryFn: () => getActiveSharedWMGoals(parentGoalId, relId),
    queryKey: ["sharedWMActiveGoals", parentGoalId, relId],
    enabled: !!parentGoalId,
  });

  return { activeSharedWMGoals, isLoading, isError, isSuccess };
};
