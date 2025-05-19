import { getSharedWMGoalById } from "@src/api/SharedWMAPI";
import { useQuery } from "react-query";

export const useGetSharedWMGoalById = (id: string) => {
  const {
    data: sharedWMGoal,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sharedWMGoals", id],
    queryFn: () => getSharedWMGoalById(id),
  });

  return { sharedWMGoal, isLoading, error };
};
