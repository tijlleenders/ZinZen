/* eslint-disable no-param-reassign */
import React, { useLayoutEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { Modal } from "antd";

import { ILanguage } from "@src/Interfaces";
import { i18n } from "@src/translations/i18n";

import { themeState } from "@src/store/ThemeState";
import { languageChangeModal, languageSelectionState, darkModeState } from "@src/store";
import "./index.scss";
import { LanguagesList } from "@components/LanguageChoice/LanguagesList";
import { getLanguages } from "@src/constants/languages";

export const LanguageChangeModal = () => {
  const [, setPosition] = useState(1);
  const open = useRecoilValue(languageChangeModal);
  const darkModeStatus = useRecoilValue(darkModeState);
  const theme = useRecoilValue(themeState);
  const [IsLanguageChosen] = useRecoilState(languageSelectionState);
  const langSelected = (lang: string, newPos: number) => {
    if (i18n.language.includes(lang)) {
      setPosition(newPos);
      return true;
    }
    return false;
  };

  const languages: ILanguage[] = getLanguages();

  const [Languages, setLanguages] = useState(languages);

  useLayoutEffect(() => {
    languages.forEach((element) => {
      if (langSelected(element.langId, element.sno)) {
        languages[0].sno = element.sno;
        languages[0].selected = false;
        element.sno = 1;
        element.selected = true;
      }
    });
    setLanguages(languages);
  }, [IsLanguageChosen]);

  return (
    <Modal
      open={!!open}
      closable={false}
      footer={null}
      centered
      onCancel={() => window.history.back()}
      width={200}
      className={`languageChangeModal popupModal${darkModeStatus ? "-dark" : ""} ${
        darkModeStatus ? "dark" : "light"
      }-theme${theme[darkModeStatus ? "dark" : "light"]}`}
    >
      <LanguagesList languages={Languages} type="modal" />
    </Modal>
  );
};
