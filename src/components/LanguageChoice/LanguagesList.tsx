import React from 'react';

import { ILanguageListProps, ILanguage } from '@src/Interfaces/ILanguage';
import { LangItem } from '@components/LanguageChoice/LangItem';

export const LanguagesList = (props : ILanguageListProps) => {
  const { languages } = props;
  return (
    <div className="containerLang">
      {languages.map((lang: ILanguage) => <LangItem key={lang.sno} lang={lang} />)}
    </div>
  );
};
