import React, { useEffect, useRef } from "react";
import i18n from "i18next";
import { useSetRecoilState } from "recoil";
import { ILanguageListProps, ILanguage } from "@src/Interfaces/ILanguage";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import { languageSelectionState } from "@src/store";
import { useLanguageSelection } from "../../hooks/useLanguageSelection";

export const LanguagesList = ({ languages, navigationCallback, type, hideSelected }: ILanguageListProps) => {
  const setIsLanguageChosen = useSetRecoilState(languageSelectionState);
  const labelRefs = useRef<HTMLLabelElement[]>([]);

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

  const focusedIndex = useLanguageSelection(languages, handleClick);

  useEffect(() => {
    labelRefs.current[focusedIndex]?.focus();
  }, [focusedIndex]);

  return (
    <div className="containerLang">
      {languages.map((lang: ILanguage, index: number) => (
        <label
          key={lang.sno}
          ref={(ref) => {
            labelRefs.current[index] = ref!;
            return null;
          }}
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
