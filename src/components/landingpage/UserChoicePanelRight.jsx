import React, { useState } from 'react'
import { LanguagesList } from '../languagechoices/LanguagesList'
import { languageSelectionState } from '../../store/LanguageSelectionState'
import { useRecoilState } from 'recoil'
import { useTranslation } from "react-i18next";
import "../../translations/i18n"

const UserChoicePanelRight = () => {
  const { t } = useTranslation();
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
    },
    {
      sno: 5,
      title: "Dutch",
      langId: "nl"
    }
  ]
  const [isLanguageChosen, setIsLanguageChosen] = useRecoilState(languageSelectionState);
  return (
    <div className="right-panel">
      <h3 className="right-panel-font">Choose your preferred Language.</h3>
      <LanguagesList languages={languages} />
    </div>
  )
}

export default UserChoicePanelRight
