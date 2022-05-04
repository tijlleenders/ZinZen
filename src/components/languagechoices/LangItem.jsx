/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import i18n from 'i18next';

import { languageSelectionState } from '../../store/LanguageSelectionState';
import './languagechoice.scss';

export function LangItem({ lang }) {
  const [, setIsLanguageChosen] = useRecoilState(
    languageSelectionState,
  );
  const handleClick = (langId) => {
    setIsLanguageChosen(true);
    i18n.changeLanguage(langId);
    localStorage.setItem('language', JSON.stringify(langId));
  };

  return (
    <div className="containerLang">
      {lang.sno % 4 === 1 ? (
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
      ) : lang.sno % 4 === 2 ? (
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
      ) : lang.sno % 4 === 3 ? (
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
}
