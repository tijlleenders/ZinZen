import { useState, useEffect } from "react";
import { GoalItem } from "@src/models/GoalItem";
import { getArchivedGoals } from "@src/api/GoalsAPI";

const useArchivedGoals = () => {
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);

  useEffect(() => {
    const fetchArchivedGoals = async () => {
      const goals = await getArchivedGoals();
      setArchivedGoals(goals);
    };
    fetchArchivedGoals();
  }, []);

  return archivedGoals;
};

export default useArchivedGoals;
