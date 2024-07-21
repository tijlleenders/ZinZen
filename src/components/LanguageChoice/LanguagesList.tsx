import React, { useEffect, useRef } from "react";
import i18n from "i18next";
import { useSetRecoilState } from "recoil";
import { ILanguageListProps, ILanguage } from "@src/Interfaces/ILanguage";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import { languageSelectionState } from "@src/store";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { useLanguageSelection } from "../../hooks/useLanguageSelection";

export const LanguagesList = ({ languages, navigationCallback, type, hideSelected }: ILanguageListProps) => {
  const setIsLanguageChosen = useSetRecoilState(languageSelectionState);
  const labelRefs = useRef<HTMLLabelElement[]>([]);

  const handleLanguageSelect = (langId: string) => {
    if (vibrateWorks) {
      navigator.vibrate(100);
    }
    setIsLanguageChosen(langId);
    i18n.changeLanguage(langId);
    localStorage.setItem(LocalStorageKeys.LANGUAGE, langId);
    if (type === "fragment" && navigationCallback) navigationCallback("/ZinZenFAQ");
    else window.history.back();
  };

  const handleClick = (event: React.MouseEvent, langId: string) => {
    event.preventDefault();
    handleLanguageSelect(langId);
  };

  const focusedIndex = useLanguageSelection(languages, handleLanguageSelect);

  useEffect(() => {
    labelRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  return (
    <div className="containerLang">
      {languages.map((lang: ILanguage, index: number) => (
        <div onMouseDown={(e) => handleClick(e, lang.langId)}>
          <label
            key={lang.sno}
            ref={(ref) => {
              labelRefs.current[index] = ref!;
            }}
            htmlFor={lang.sno.toString()}
            className={`${lang.selected && !hideSelected ? "selected" : ""} ${focusedIndex === index ? "focused" : ""}`}
          >
            {lang.title}
            <input type="radio" checked={lang.selected} readOnly id={lang.sno.toString()} />
          </label>
        </div>
      ))}
    </div>
  );
};
