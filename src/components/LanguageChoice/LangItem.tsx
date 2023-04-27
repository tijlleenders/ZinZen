/* eslint-disable no-unused-expressions */
import React from "react";
import i18n from "i18next";
import { useRecoilState } from "recoil";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { ILanguage } from "@src/Interfaces/ILanguage";
import { languageSelectionState } from "@store";
import { vibrateWorks } from "@src/constants/vibrateCheck";

export const LangItem = ({ lang }: { lang: ILanguage }) => {
  const navigate = useNavigate();
  const [, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  const remainder: number = Number(lang.sno) % 4;
  const handleClick = (langId: string) => {
    (vibrateWorks) ? navigator.vibrate(100) : null;
    setIsLanguageChosen(langId);
    i18n.changeLanguage(langId);
    localStorage.setItem("language", JSON.stringify(langId));
    navigate("/QueryZinZen");
  };

  return (
    <div className="containerLang">
      <button
        type="button"
        className={(lang.selected) ? "lang-btn1 selected" : "lang-btn1"}
        onClick={() => { handleClick(lang.langId); }}
      >
        {lang.title}
        <input type="radio" checked={lang.selected} readOnly />
      </button>
    </div>
  );
};
