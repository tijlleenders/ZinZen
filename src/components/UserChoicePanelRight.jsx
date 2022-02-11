import React, { useState } from 'react'
import { LanguagesList } from './LanguagesList'
import ThemesChoice from './ThemesChoice'
import { languageSelectionState } from '../store/LanguageSelectionState'
import { useRecoilState } from 'recoil'

const UserChoicePanelRight = () => {
  let languages = [
    {
      sno: 1,
      title: "English",
      langId: "en"
    },
    {
      sno: 2,
      title: "French",
      langId: "fr"
    },
    {
      sno: 3,
      title: "Hindi",
      langId: "hi"
    },
    {
      sno: 4,
      title: "Spanish",
      langId: "es"
    }
  ]
  const [isLanguageChosen, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  return (
    <div>
      {(isLanguageChosen==="No language chosen.") ? (<div className="right-panel">
        <h3 className="right-panel-font">Choose your preferred Language.</h3>
        <LanguagesList languages={languages} />
      </div>) :
        (<div className="right-panel">
        <h3 className="right-panel-font">Choose your preferred Theme.</h3>
        <ThemesChoice />
      </div>)}
    </div>)
}

export default UserChoicePanelRight
