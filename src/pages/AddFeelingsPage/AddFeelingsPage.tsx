// @ts-nocheck
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { ArrowRightShort } from "react-bootstrap-icons";
import { useRecoilValue, useSetRecoilState } from "recoil";

import { darkModeState } from "@store";
import { getJustDate } from "@utils";
import { themeState } from "@src/store/ThemeState";
import { displayAddFeeling } from "@src/store/FeelingsState";
import { AddFeelingsPageProps } from "@src/Interfaces/IPages";
import { addFeelingWithNote, addFeeling } from "@src/api/FeelingsAPI";
import { feelingsList, feelingsCategories, feelingsEmojis } from "@consts/FeelingsList";

import "@translations/i18n";
import "./AddFeelingsPage.scss";

export const AddFeelingsPage: React.FC<AddFeelingsPageProps> = ({ feelingDate }) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const date = feelingDate
    ? getJustDate(feelingDate)
    : getJustDate(new Date());

  const [feelingNote, setFeelingNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [choice, setChoice] = useState(0);
  const [customFeeling, setCustomFeeling] = useState<string>("");
  const theme = useRecoilValue(themeState); 

  const setShowAddFeelingsModal = useSetRecoilState(displayAddFeeling);

  const addThisFeeling = async (directAdd = "") => {
    if (directAdd !== "") {
      await addFeeling(directAdd, directAdd, date);
    } else if (feelingNote && feelingNote !== "") {
      await addFeelingWithNote(customFeeling === "" ? t(feelingsList[selectedCategory][choice]) : customFeeling, selectedCategory, date, feelingNote);
    } else {
      await addFeeling(customFeeling === "" ? t(feelingsList[selectedCategory][choice]) : customFeeling, selectedCategory, date);
    }
    setSelectedCategory("");
    setCustomFeeling("");
    setFeelingNote("");
    setChoice(0);
    setShowAddFeelingsModal(false);
  };
  return (
    <Modal
      className={`notes-modal${darkModeStatus ? "-dark" : ""} popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
      show={!!feelingDate}
      onHide={() => { setShowAddFeelingsModal(false); setSelectedCategory(""); }}
    >
      { selectedCategory === "" ? (
        <Modal.Body>
          <div id="addFeelings-container">
            <p className="popupModal-title">
              {date.getTime() === getJustDate(new Date()).getTime()
                ? t("feelingsmessage")
                : `${t("feelingsMessagePast")} ${date.toDateString()}`}
            </p>
            <div>
              {feelingsCategories.map((category: string) => (
                <div key={`feeling-${category}`} className={`feelings-category${darkModeStatus ? "-dark" : ""}`}>
                  <button type="button" onClick={async () => { await addThisFeeling(category); }}>
                    {feelingsEmojis[category]}&nbsp;&nbsp;
                    {t(category)}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                    }}
                  > <ArrowRightShort width={24} height={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </Modal.Body>
      )
        :
        (
          <>
            <Modal.Body id={`feeling-modal-body${darkModeStatus ? "-dark" : ""}`}>
              <p className="heading">{`You feel ${customFeeling === "" ? t(feelingsList[selectedCategory][choice]) : customFeeling}`}</p>
              <div id={`feelingOptions${darkModeStatus ? "-dark" : ""}`}>
                { selectedCategory !== "" && feelingsList[selectedCategory].map((feeling, index) => (
                  <button
                    type="button"
                    className={`feelingOption${choice === index ? "-selected" : ""}`}
                    key={`feelingOption-${feeling}`}
                    onClick={() => { setChoice(index); setCustomFeeling(""); }}
                  >
                    {t(feeling)}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="New Feeling? Write here..."
                  id="myfeelings-custom-feeling-input"
                  onChange={(e) => { setCustomFeeling(e.target.value); setChoice(e.target.value === "" ? 0 : -1); }}
                  value={customFeeling}
                />
              </div>
              <input
                type="text"
                placeholder="Add Note"
                id="myfeelings-note-input"
                onChange={(e) => { setFeelingNote(e.target.value); }}
              />
            </Modal.Body>
            <Modal.Footer>
              <button
                type="submit"
                onClick={async () => { await addThisFeeling(); }}
                className={`feelingsModal-btn${darkModeStatus ? "-dark" : ""}`}
              >
                Done
              </button>
            </Modal.Footer>
          </>
        )}
    </Modal>
  );
};
