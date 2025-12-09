import { GoalItem } from "@src/models/GoalItem";
import { useCallback, useEffect, useRef } from "react";
import { extractLinks } from "@src/utils/patterns";
import { ILocationState } from "@src/Interfaces";
import { useLocation, useNavigate, useSearch } from "@tanstack/react-router";

interface UseGoalKeyboardNavigationProps {
  goals: GoalItem[];
}

export const useGoalKeyboardNavigation = ({ goals }: UseGoalKeyboardNavigationProps): void => {
  const search = useSearch({ strict: false }) as { focus?: string; showOptions?: string };
  const location = useLocation();
  const navigate = useNavigate();

  const goalsRef = useRef(goals);
  const searchRef = useRef(search);
  const locationRef = useRef(location);
  const navigateRef = useRef(navigate);

  useEffect(() => {
    goalsRef.current = goals;
  }, [goals]);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);

  const handleRightKeyPress = useCallback((goal: GoalItem) => {
    if (!goal) return;
    const url = extractLinks(goal.title);
    if (url) {
      const finalUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(finalUrl, "_blank");
      return;
    }
    const currentLocation = locationRef.current;
    const newState: ILocationState = {
      ...currentLocation.state,
      goalsHistory: [
        ...(currentLocation.state?.goalsHistory || []),
        { goalID: goal.id || "root", goalColor: goal.goalColor || "#ffffff", goalTitle: goal.title || "" },
      ],
    };
    navigateRef.current({ to: "/goals/$parentId", params: { parentId: goal.id }, state: newState });
  }, []);

  const handleFocusChange = useCallback((newIndex: number) => {
    const currentGoals = goalsRef.current;
    if (currentGoals.length === 0) return;
    const adjustedIndex = (newIndex + currentGoals.length) % currentGoals.length;
    const currentLocation = locationRef.current;
    navigateRef.current({
      to: ".",
      search: (prev) => ({ ...prev, focus: adjustedIndex.toString() }),
      replace: true,
      state: currentLocation.state,
    });
    setTimeout(() => {
      const goalElement = document.getElementById(`goal-${currentGoals[adjustedIndex]?.id}`);
      if (goalElement) {
        goalElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 0);
  }, []);

  const openGoalActionsModal = useCallback((goal: GoalItem) => {
    if (!goal) return;
    const currentLocation = locationRef.current;

    if (goal.parentGoalId === "root") {
      navigateRef.current({
        to: "/goals/$parentId/$activeGoalId",
        params: { parentId: "root", activeGoalId: goal.id },
        search: (prev: { show?: "backupModal" | "langChangeModal" | undefined }) => ({ ...prev, showOptions: "true" }),
        state: currentLocation.state,
      });
    } else {
      navigateRef.current({
        to: "/goals/$parentId/$activeGoalId",
        params: { parentId: goal.parentGoalId, activeGoalId: goal.id },
        search: (prev: { show?: "backupModal" | "langChangeModal" | undefined }) => ({ ...prev, showOptions: "true" }),
        state: currentLocation.state,
      });
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
      }

      const currentSearch = searchRef.current;
      const currentGoals = goalsRef.current;
      const focusIndex = Number(currentSearch.focus || -1);

      switch (e.key) {
        case "ArrowDown":
          handleFocusChange(focusIndex + 1);
          break;
        case "ArrowUp":
          handleFocusChange(focusIndex - 1);
          break;
        case "ArrowRight":
          if (currentGoals.length > 0 && focusIndex >= 0 && focusIndex < currentGoals.length) {
            handleRightKeyPress(currentGoals[focusIndex]);
          }
          break;
        case "ArrowLeft":
          if (locationRef.current.pathname === "/goals") {
            return;
          }
          window.history.back();
          break;
        case " ":
          if (currentGoals.length > 0 && focusIndex >= 0 && focusIndex < currentGoals.length) {
            openGoalActionsModal(currentGoals[focusIndex]);
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleFocusChange, handleRightKeyPress, openGoalActionsModal]);
};
