import React from 'react'
import { LangItem } from './LangItem'

export const Languages = (props) => {
  return (
    <div className="containerLang">
      {props.languages.map((lang) => {
        return <LangItem lang={lang} />
      })}
    </div>
  )
}


