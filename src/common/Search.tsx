/* eslint-disable jsx-a11y/no-autofocus */
import React from "react";
import { useTranslation } from "react-i18next";

import backIcon from "@assets/images/backIcon.svg";
import { useRecoilState } from "recoil";
import { searchQueryState, showSearchState } from "@src/store/GoalsState";

import "./Search.scss";

const Search = () => {
  const { t } = useTranslation();
  const [showSearch, setShowSearch] = useRecoilState(showSearchState);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleClose = () => {
    setShowSearch(!showSearch);
    setSearchQuery("");
  };

  return (
    <div className="header-search-container">
      <button type="button" className="theme-icon ordinary-element" onClick={handleClose}>
        <img src={backIcon} alt="zinzen search" />
      </button>
      <input
        className="header-search ordinary-element"
        placeholder={t("search")}
        autoFocus
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
