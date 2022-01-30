import React from 'react'
import { Button, } from 'react-bootstrap'
import { languageSelectionState } from '../store/LanguageSelectionState'
import { useRecoilState } from 'recoil'

export const LangItem = ({ lang }) => {
    const [isLanguageChosen, setIsLanguageChosen]=useRecoilState(languageSelectionState);
    return (
        <div className="containerLang">
            <br/>
            <Button variant="primary" size="lg" className="lang-btn" onClick={() => {setIsLanguageChosen(true)}}>
                {lang.title}
            </Button>
        </div>
    )
}


