import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import { useRecoilState } from "recoil";
import { searchActive } from "@src/store";
import { showSearchState } from "@src/store/GoalsState";

export const useSearchState = () => {
  const [showSearch, setShowSearch] = useRecoilState(showSearchState);
  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);

  const displaySearchState = useRouterState({
    select: (state) => state.location.state.displaySearch || false,
  });

  useEffect(() => {
    if (displaySearch || displaySearchState) {
      setDisplaySearch(displaySearchState || false);
    }
  }, [displaySearchState, displaySearch, setDisplaySearch]);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return {
    showSearch,
    toggleSearch,
  };
};
