import React from "react";

import { LangItem } from "@components/LanguageChoice/LangItem";
import { ILanguageListProps, ILanguage } from "@src/Interfaces/ILanguage";

export const LanguagesList = (props: ILanguageListProps) => {
  const { languages } = props;
  return (
    <div className="containerLang">
      {languages.map((lang: ILanguage) => (
        <LangItem key={String(lang.sno)} lang={lang} />
      ))}
    </div>
  );
};
