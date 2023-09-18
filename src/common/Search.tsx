/* eslint-disable jsx-a11y/no-autofocus */
import React, { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import backIcon from "@assets/images/backIcon.svg";

const Search = ({ debounceSearch }: { debounceSearch: (event: ChangeEvent<HTMLInputElement>) => void }) => {
  const { t } = useTranslation();
  return (
    <div className="header-search-container" style={{ display: "flex", gap: "10px" }}>
      <button
        type="button"
        style={{ display: "flex", padding: 0 }}
        className="theme-icon ordinary-element"
        onClick={() => {
          window.history.back();
        }}
      >
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
