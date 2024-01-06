// @ts-nocheck
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from "recoil";

import backIcon from "@assets/images/backIcon.svg";

import { darkModeState } from "@store";
import { getJustDate } from "@utils";
import { themeState } from "@src/store/ThemeState";
import { addFeelingWithNote, addFeeling } from "@src/api/FeelingsAPI";
import { feelingsList, feelingsCategories, feelingsEmojis } from "@consts/FeelingsList";

import "@translations/i18n";
import "./AddFeeling.scss";
import ZModal from "@src/common/ZModal";

export const AddFeeling = ({ feelingDate }: { feelingDate: Date | null }) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const date = feelingDate ? getJustDate(feelingDate) : getJustDate(new Date());

  const [feelingNote, setFeelingNote] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [choice, setChoice] = useState(0);
  const [customFeeling, setCustomFeeling] = useState<string>("");
  const theme = useRecoilValue(themeState);

  const addThisFeeling = async (directAdd = "") => {
    if (directAdd !== "") {
      await addFeeling(directAdd, directAdd, date);
    } else if (feelingNote && feelingNote !== "") {
      await addFeelingWithNote(
        customFeeling === "" ? t(feelingsList[selectedCategory][choice]) : customFeeling,
        selectedCategory,
        date,
        feelingNote,
      );
    } else {
      await addFeeling(
        customFeeling === "" ? t(feelingsList[selectedCategory][choice]) : customFeeling,
        selectedCategory,
        date,
      );
    }
    window.history.back();
  };
  return (
    <ZModal
      type={`notes-modal${darkModeStatus ? "-dark" : ""}`}
      open={!!feelingDate}
      onCancel={() => window.history.back()}
    >
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
                  {" "}
                  <img alt="add feeling" src={backIcon} className="chevronRight theme-icon" />
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div id="addFeelings-container">
          <p className="popupModal-title">{`You feel ${
            customFeeling === "" ? t(feelingsList[selectedCategory][choice]) : customFeeling
          }`}</p>
          <div id="feelingOptions">
            {selectedCategory !== "" &&
              feelingsList[selectedCategory].map((feeling, index) => (
                <button
                  type="button"
                  className={`feelingOption${choice === index ? "-selected" : ""}`}
                  key={`feelingOption-${feeling}`}
                  onClick={() => {
                    setChoice(index);
                    setCustomFeeling("");
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
              setCustomFeeling(e.target.value);
              setChoice(e.target.value === "" ? 0 : -1);
            }}
            value={customFeeling}
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
            {" "}
            Save
          </button>
        </div>
      )}
    </ZModal>
  );
};
