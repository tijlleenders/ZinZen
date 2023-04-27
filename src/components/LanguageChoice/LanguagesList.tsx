import React from "react";
import i18n from "i18next";

import { ILanguageListProps, ILanguage } from "@src/Interfaces/ILanguage";
import { useNavigate } from "react-router-dom";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import { languageSelectionState } from "@src/store";
import { useRecoilState } from "recoil";

export const LanguagesList = (props: ILanguageListProps) => {
  const { languages } = props;
  const navigate = useNavigate();
  const [, setIsLanguageChosen] = useRecoilState(languageSelectionState);

  const handleClick = (langId: string) => {
    (vibrateWorks) ? navigator.vibrate(100) : null;
    setIsLanguageChosen(langId);
    i18n.changeLanguage(langId);
    localStorage.setItem("language", JSON.stringify(langId));
    navigate("/QueryZinZen");
  };
  return (
    <div className="containerLang">
      {languages.map((lang: ILanguage) => (
        <button
          key={String(lang.sno)}
          type="button"
          className={lang.selected ? "selected" : ""}
          onClick={() => { handleClick(lang.langId); }}
        >
          {lang.title}
          <input type="radio" checked={lang.selected} readOnly />
        </button>
      ))}
    </div>
  );
};
