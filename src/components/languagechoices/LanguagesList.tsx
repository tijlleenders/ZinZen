import React from 'react';

import { ILanguage, ILanguageListProps } from 'Interfaces/ILanguage';
import { LangItem } from './LangItem';

export function LanguagesList(props : ILanguageListProps) {
  const { languages } = props;
  return (
    <div className="containerLang">
      {languages.map((lang: ILanguage) => <LangItem lang={lang} />)}
    </div>
  );
}
