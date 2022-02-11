import React from 'react'
import { LangItem } from './LangItem'

export const LanguagesList = (props) => {
  return (
    <div className="containerLang">
      {props.languages.map((lang) => {
        return <LangItem lang={lang} />
      })}
    </div>
  )
}


