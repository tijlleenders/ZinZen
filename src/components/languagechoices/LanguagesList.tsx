import React from 'react';

import { ILanguageListProps } from '@src/interfaces';
import { LangItem } from './LangItem';

export function LanguagesList(props : ILanguageListProps) {
  const { languages } = props;
  return (
    <div className="containerLang">
      {languages.map((lang) => <LangItem lang={lang} />)}
    </div>
  );
}
