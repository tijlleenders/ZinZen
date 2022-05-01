/* eslint-disable react/prop-types */
/* eslint-disable react/destructuring-assignment */
import React from 'react';

import { LangItem } from './LangItem';

export function LanguagesList(props) {
  return (
    <div className="containerLang">
      {props.languages.map((lang) => <LangItem lang={lang} />)}
    </div>
  );
}
