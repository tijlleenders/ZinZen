import { useNavigate } from "@tanstack/react-router";

export const useGoalNavigation = (basePath: string) => {
  const navigate = useNavigate();

  const go = (search: any, replace = false) => {
    navigate({
      to: basePath,
      search,
      state: (s) => ({ ...s }),
      replace,
    });
  };

  const addStandard = (replace = false) => go({ type: "Standard", mode: "add" }, replace);
  const addBudget = () => go({ type: "Budget", mode: "add" }, true);
  const showGoalFabOptions = () => go({ addOptions: true });

  return {
    addStandard,
    addBudget,
    showGoalFabOptions,
  };
};
