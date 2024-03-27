import React from "react";
import i18n from "i18next";

import { useRecoilState } from "recoil";
import { ILanguageListProps, ILanguage } from "@src/Interfaces/ILanguage";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import { languageSelectionState } from "@src/store";

export const LanguagesList = (props: ILanguageListProps) => {
  const { languages, navigationCallback, type, hideSelected } = props;
  const [, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  const sortedLanguages = [languages[0], ...languages.slice(1).sort((a, b) => a.title.localeCompare(b.title))];

  const handleClick = (langId: string) => {
    vibrateWorks ? navigator.vibrate(100) : null;
    setIsLanguageChosen(langId);
    i18n.changeLanguage(langId);
    localStorage.setItem("language", JSON.stringify(langId));
    if (type === "fragment" && navigationCallback) navigationCallback("/ZinZenFAQ");
    else window.history.back();
  };
  return (
    <div className="containerLang">
      {sortedLanguages.map((lang: ILanguage) => (
        <button
          key={String(lang.sno)}
          type="button"
          className={lang.selected && !hideSelected ? "selected" : ""}
          onClick={() => {
            handleClick(lang.langId);
          }}
        >
          {lang.title}
          <input type="radio" checked={lang.selected} readOnly />
        </button>
      ))}
    </div>
  );
};
