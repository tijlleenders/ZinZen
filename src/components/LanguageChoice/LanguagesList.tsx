import React from "react";
import i18n from "i18next";
import { useRecoilState } from "recoil";
import { ILanguageListProps, ILanguage } from "@src/Interfaces/ILanguage";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import { languageSelectionState } from "@src/store";

export const LanguagesList = ({ languages, navigationCallback, type, hideSelected }: ILanguageListProps) => {
  const [, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  const sortedLanguages = [languages[0], ...languages.slice(1).sort((a, b) => a.title.localeCompare(b.title))];

  const handleClick = (langId: string) => {
    if (vibrateWorks) {
      navigator.vibrate(100);
    }
    setIsLanguageChosen(langId);
    i18n.changeLanguage(langId);
    localStorage.setItem("language", JSON.stringify(langId));
    if (type === "fragment" && navigationCallback) navigationCallback("/ZinZenFAQ");
    else window.history.back();
  };

  return (
    <div className="containerLang">
      {sortedLanguages.map((lang: ILanguage) => (
        <label
          key={lang.sno}
          htmlFor={lang.sno.toString()}
          className={lang.selected && !hideSelected ? "selected" : ""}
        >
          {lang.title}
          <input
            type="radio"
            onClick={() => handleClick(lang.langId)}
            checked={lang.selected}
            readOnly
            id={lang.sno.toString()}
          />
        </label>
      ))}
    </div>
  );
};
