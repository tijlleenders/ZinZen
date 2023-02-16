import { darkModeState, searchActive } from "@src/store";
import React, { ChangeEvent } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import deleteIcon from "@assets/images/deleteIcon.svg";

const Search = ({ debounceSearch }: { debounceSearch: (event: ChangeEvent<HTMLInputElement>) => void}) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const setDisplaySearch = useSetRecoilState(searchActive);
  return (
    <div style={{ display: "flex", gap: "10px" }}><input
      id={darkModeStatus ? "goal-searchBar-dark" : "goal-searchBar"}
      placeholder={t("search")}
      onChange={(e) => debounceSearch(e)}
    />
      <button
        type="button"
        style={{ margin: "0 8% 2% 8px",
          background: "none",
          border: "none" }}
        onClick={() => setDisplaySearch(false)}
      >
        <img
          alt="cancel search"
          src={deleteIcon}
          className={`${darkModeStatus ? "dark-svg" : ""}`}
          style={{ cursor: "pointer" }}
        />
      </button>
    </div>
  );
};

export default Search;
