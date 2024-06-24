// @ts-nocheck
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import backIcon from "@assets/images/backIcon.svg";

import { darkModeState } from "@store";
import { getJustDate } from "@utils";
import { addFeeling } from "@src/api/FeelingsAPI";
import { feelingsList, feelingsCategories, feelingsEmojis } from "@consts/FeelingsList";

import "@translations/i18n";
import "./AddFeeling.scss";
import ZModal from "@src/common/ZModal";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";

export const AddFeeling = ({ feelingDate }: { feelingDate: Date | null }) => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const date = feelingDate ? getJustDate(feelingDate) : getJustDate(new Date());

  const [feelingNote, setFeelingNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [customFeeling, setCustomFeeling] = useState({
    text: "",
    emojiIndx: 0,
  });

  const addThisFeeling = async (directCategory?: string) => {
    const { emojiIndx, text } = customFeeling;
    const optedCategory = directCategory || selectedCategory;
    await addFeeling({
      content: text || t(feelingsList[optedCategory][emojiIndx]),
      category: optedCategory,
      date,
      note: feelingNote,
    });
    queryClient.invalidateQueries("feelings");
    navigate(-1);
  };
  return (
    <ZModal type={`notes-modal${darkModeStatus ? "-dark" : ""}`} open={!!feelingDate} onCancel={window.history.back}>
      {selectedCategory === "" ? (
        <>
          <p className="popupModal-title">
            {date.getTime() === getJustDate(new Date()).getTime()
              ? t("feelingsMessage")
              : `${t("feelingsMessagePast")} ${date.toDateString()}`}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {feelingsCategories.map((category: string) => (
              <div key={`feeling-${category}`} className="feelings-category">
                <button
                  type="button"
                  onClick={async () => {
                    await addThisFeeling(category);
                  }}
                >
                  {feelingsEmojis[category]}&nbsp;&nbsp;
                  {t(category)}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory(category);
                  }}
                >
                  <img alt="add feeling" src={backIcon} className="chevronRight theme-icon" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div id="addFeelings-container">
          <p className="popupModal-title">{`You feel ${
            customFeeling === "" ? t(feelingsList[selectedCategory][customFeeling.emojiIndx]) : customFeeling.text
          }`}</p>
          <div id="feelingOptions">
            {selectedCategory !== "" &&
              feelingsList[selectedCategory].map((feeling, index) => (
                <button
                  type="button"
                  className={`feelingOption${customFeeling.emojiIndx === index ? "-selected" : ""}`}
                  key={`feelingOption-${feeling}`}
                  onClick={() => {
                    setCustomFeeling({
                      text: "",
                      emojiIndx: index,
                    });
                  }}
                >
                  {t(feeling)}
                </button>
              ))}
          </div>
          <input
            type="text"
            placeholder="New Feeling? Write here..."
            onChange={(e) => {
              setCustomFeeling({
                text: e.target.value,
                emojiIndx: e.target.value === "" ? 0 : -1,
              });
            }}
            value={customFeeling.text}
          />
          <input
            type="text"
            placeholder="Add Note"
            onChange={(e) => {
              setFeelingNote(e.target.value);
            }}
          />
          <button
            type="button"
            onClick={async () => {
              await addThisFeeling();
            }}
            className={`action-btn submit-icon${darkModeStatus ? "-dark" : ""}`}
          >
            Save
          </button>
        </div>
      )}
    </ZModal>
  );
};
