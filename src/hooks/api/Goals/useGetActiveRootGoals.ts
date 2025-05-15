import { getActiveRootGoals } from "@src/api/GoalsAPI";
import { useQuery } from "react-query";

export const useGetActiveRootGoals = () => {
  const {
    data: activeRootGoals,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["activeRootGoals"],
    queryFn: () => getActiveRootGoals(),
  });
  return { activeRootGoals, isLoading, error };
};
