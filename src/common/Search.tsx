/* eslint-disable jsx-a11y/no-autofocus */
import { darkModeState, searchActive } from "@src/store";
import React, { ChangeEvent } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import backIcon from "@assets/images/backIcon.svg";

const Search = ({ debounceSearch }: { debounceSearch: (event: ChangeEvent<HTMLInputElement>) => void}) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const setDisplaySearch = useSetRecoilState(searchActive);
  return (
    <div className="header-search-container" style={{ display: "flex", gap: "10px" }}>
      <button type="button" style={{ padding: 0 }} className="ordinary-element" onClick={() => { setDisplaySearch(false); }}>
        <img src={backIcon} alt="zinzen search" />
      </button>
      <input
        className="header-search ordinary-element"
        placeholder={t("search")}
        autoFocus
        onChange={(e) => debounceSearch(e)}
      />
    </div>
  );
};

export default Search;
