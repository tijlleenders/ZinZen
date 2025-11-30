import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { ILocationState } from "@src/Interfaces";

export interface BottomNavbarNavigationHandlers {
  onScheduleClick?: () => void;
  onGoalsClick?: () => void;
  onJournalClick?: () => void;
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
    if (!window.location.pathname.includes("/goals")) {
      navigate({
        to: "/goals/$parentId",
        params: { parentId: "root" },
        state: (prevState) => ({ ...prevState, ...newState }),
      });
    }
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

  return {
    onScheduleClick: handleScheduleClick,
    onGoalsClick: handleGoalsClick,
    onJournalClick: handleJournalClick,
  };
};
