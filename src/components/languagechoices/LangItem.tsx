/* eslint-disable react/prop-types */
import React from 'react';
import { Button } from 'react-bootstrap';
import { useRecoilState } from 'recoil';
import i18n from 'i18next';

import { ILanguage } from '@src/interfaces/ILanguage';
import { languageSelectionState } from '@store';

import './languagechoice.scss';

export function LangItem({ lang } : {lang:ILanguage}) {
  const [, setIsLanguageChosen] = useRecoilState(
    languageSelectionState,
  );
  const remainder : Number = Number(lang.sno) % 4;
  const handleClick = (langId : string) => {
    setIsLanguageChosen(true);
    i18n.changeLanguage(langId);
    localStorage.setItem('language', JSON.stringify(langId));
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
}
