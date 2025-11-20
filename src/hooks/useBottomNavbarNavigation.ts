import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { ILocationState } from "@src/Interfaces";
import { getGoalById } from "@src/api/GoalsAPI";

export interface BottomNavbarNavigationHandlers {
  onScheduleClick?: () => void;
  onGoalsClick?: () => void;
  onJournalClick?: () => void;
  onGoalsGoBack?: () => void;
}

export const useBottomNavbarNavigation = (): BottomNavbarNavigationHandlers => {
  const navigate = useNavigate();

  const createNavigationState = useCallback((): ILocationState => {
    return {
      displayFocus: false,
    };
  }, []);

  const handleScheduleClick = useCallback(() => {
    const newState = createNavigationState();
    navigate({
      to: "/",
      state: (prevState) => ({
        ...prevState,
        ...newState,
      }),
    });
  }, [navigate, createNavigationState]);

  const handleGoalsClick = useCallback(() => {
    const newState = createNavigationState();
    navigate({
      to: "/goals/$parentId",
      params: { parentId: "root" },
      state: (prevState) => ({ ...prevState, ...newState }),
    });
  }, [navigate, createNavigationState]);

  const handleJournalClick = useCallback(() => {
    const newState = createNavigationState();
    navigate({
      to: "/MyJournal",
      state: (prevState) => ({
        ...prevState,
        ...newState,
      }),
    });
  }, [navigate, createNavigationState]);

  const handleGoalsGoBack = useCallback(() => {
    const currentParentId = window.location.pathname.split("/")[2];
    getGoalById(currentParentId).then((goal) => {
      if (goal) {
        window.history.go(-goal.depth);
      }
    });
  }, []);

  return {
    onScheduleClick: handleScheduleClick,
    onGoalsClick: handleGoalsClick,
    onJournalClick: handleJournalClick,
    onGoalsGoBack: handleGoalsGoBack,
  };
};
