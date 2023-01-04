import React from "react";
import i18n from "i18next";
import { Button } from "react-bootstrap";
import { useRecoilState } from "recoil";
import { useNavigate } from "react-router-dom";

import { ILanguage } from "@src/Interfaces/ILanguage";
import { languageSelectionState } from "@store";
import { vibrateWorks } from "@src/constants/vibrateCheck";
import "./LanguageChoice.scss";

export const LangItem = ({ lang }: { lang: ILanguage }) => {
  const navigate = useNavigate();
  const [, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  const remainder: number = Number(lang.sno) % 4;
  const handleClick = (langId: string) => {
    (vibrateWorks)?navigator.vibrate(100):null;
    setIsLanguageChosen(langId);
    i18n.changeLanguage(langId);
    localStorage.setItem("language", JSON.stringify(langId));
    navigate("/");
  };

  return (
    <div className="containerLang">
      {remainder === 1 ? (
        <Button
          variant="peach"
          size="lg"
          className="lang-btn1"
          onClick={() => {
            handleClick(lang.langId);
          }}
        >
          {lang.title}
        </Button>
      ) : remainder === 2 ? (
        <Button
          variant="dark-pink"
          size="lg"
          className="lang-btn1"
          onClick={() => {
            handleClick(lang.langId);
          }}
        >
          {lang.title}
        </Button>
      ) : remainder === 3 ? (
        <Button
          variant="grey-base"
          size="lg"
          className="lang-btn2"
          onClick={() => {
            handleClick(lang.langId);
          }}
        >
          {lang.title}
        </Button>
      ) : (
        <Button
          variant="pale-blue"
          size="lg"
          className="lang-btn2"
          onClick={() => {
            handleClick(lang.langId);
          }}
        >
          {lang.title}
        </Button>
      )}
    </div>
  );
};
