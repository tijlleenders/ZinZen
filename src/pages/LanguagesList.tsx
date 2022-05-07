import React from 'react';

import { ILanguageListProps } from '@src/interfaces';
import { LangItem } from '../components/languagechoices/LangItem';

export function LanguagesList(props : ILanguageListProps) {
  const { languages } = props;
  return (
    <div className="containerLang">
      {languages.map((lang:string) => <LangItem lang={lang} />)}
    </div>
  );
}
