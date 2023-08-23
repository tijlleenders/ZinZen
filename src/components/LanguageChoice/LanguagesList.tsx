import React from "react";
import i18n from "i18next";

import { useRecoilState } from "recoil";
import { ILanguageListProps, ILanguage } from "@src/Interfaces/ILanguage";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import { languageChangeModal, languageSelectionState } from "@src/store";

export const LanguagesList = (props: ILanguageListProps) => {
  const { languages, navigationCallback, type } = props;
  const [, setIsLanguageChosen] = useRecoilState(languageSelectionState);

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
      {languages.map((lang: ILanguage) => (
        <button
          key={String(lang.sno)}
          type="button"
          className={lang.selected ? "selected" : ""}
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
