import { useRecoilState } from "recoil";
import { showSearchState } from "@src/store/GoalsState";

export const useSearchState = () => {
  const [showSearch, setShowSearch] = useRecoilState(showSearchState);

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return {
    showSearch,
    toggleSearch,
  };
};
