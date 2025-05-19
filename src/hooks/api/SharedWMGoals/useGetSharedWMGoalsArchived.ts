import { useQuery } from "react-query";
import { getArchivedSharedWMGoals } from "@src/api/SharedWMAPI";
import { useParams } from "react-router-dom";

export const useGetSharedWMGoalsArchived = (parentGoalId: string, relId: string) => {
  const { partnerId } = useParams();

  const {
    data: archivedSharedWMGoals,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["sharedWMGoalsArchived", parentGoalId, relId],
    queryFn: () => getArchivedSharedWMGoals(parentGoalId, relId),
    enabled: !!partnerId,
  });

  return { data: archivedSharedWMGoals, isLoading, isError };
};
