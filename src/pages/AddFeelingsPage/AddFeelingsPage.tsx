// @ts-nocheck
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { ChevronRight } from "react-bootstrap-icons";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import { feelingsList, feelingsCategories, feelingsEmojis } from "@consts/FeelingsList";
import { darkModeState } from "@store";
import { getJustDate } from "@utils";
import { addFeelingWithNote, addFeeling } from "@src/api/FeelingsAPI";

import "@translations/i18n";
import "./AddFeelingsPage.scss";

interface AddFeelingsPageProps {
  feelingDate: Date | null;
  setShowAddFeelingsModal: React.Dispatch<React.SetStateAction<Date | null>>;
}

export const AddFeelingsPage: React.FC<AddFeelingsPageProps> = ({ feelingDate, setShowAddFeelingsModal }) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const date = feelingDate
    ? getJustDate(feelingDate)
    : getJustDate(new Date());

  const [feelingNote, setFeelingNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [choice, setChoice] = useState(0);
  const [customFeeling, setCustomFeeling] = useState<string>("");

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
    setShowAddFeelingsModal(null);
  };
  return (
    <Modal
      className={`popupModal${darkModeStatus ? "-dark" : ""}`}
      show={!!feelingDate}
      onHide={() => { setShowAddFeelingsModal(null); setSelectedCategory(""); }}
    >
      { selectedCategory === "" ? (
        <Modal.Body>
          <div id="addFeelings-container">
            <h1>
              {date.getTime() === getJustDate(new Date()).getTime()
                ? t("feelingsmessage")
                : `${t("feelingsMessagePast")} ${date.toDateString()}`}
            </h1>
            <div>
              {feelingsCategories.map((category: string) => (
                <div key={`feeling-${category}`} className="feelings-menu-mobile">
                  <div className={`feelings-category${darkModeStatus ? "-dark" : ""}`}>
                    <button type="button" onClick={async () => { await addThisFeeling(category); }}>
                      {feelingsEmojis[category]}&nbsp;&nbsp;
                      {t(category)}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                      }}
                    > <ChevronRight />
                    </button>
                  </div>
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
