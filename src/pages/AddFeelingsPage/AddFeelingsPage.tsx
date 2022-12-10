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
  const [customFeeling, setCustomFeeling] = useState<string>("");

  const addThisFeeling = async (directAdd = "") => {
    if (directAdd !== "") {
      await addFeeling(directAdd, directAdd, date);
    } else if (feelingNote && feelingNote !== "") {
      await addFeelingWithNote(customFeeling === "" ? selectedCategory : customFeeling, selectedCategory, date, feelingNote);
    } else {
      await addFeeling(customFeeling === "" ? selectedCategory : customFeeling, selectedCategory, date);
    }
    setSelectedCategory("");
    setCustomFeeling("");
    setFeelingNote("");
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
              <p className="heading">{`You feel ${customFeeling === "" ? t(selectedCategory) : customFeeling}`}</p>
              <input
                type="text"
                placeholder="I Feel..."
                id="myfeelings-custom-feeling-input"
                onChange={(e) => { setCustomFeeling(e.target.value); }}
                value={customFeeling}
              />
              <p id="feeling-reason-ques">Can you be more specific?</p>
              <div id="feelingOptions">
                { selectedCategory !== "" && feelingsList[selectedCategory].map((feeling) => (
                  <button
                    type="button"
                    className={`feelingOption-name feelingOption-${selectedCategory === feeling ? "selected" : ""}`}
                    key={`feelingOption-${feeling}`}
                    style={customFeeling === feeling ? { background: "#EEB8A7" } : {}}
                    onClick={() => { setCustomFeeling(feeling); }}
                  >
                    {t(feeling)}
                  </button>
                ))}
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
