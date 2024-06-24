import React, { useState } from "react";
import { Row, Col } from "antd";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useQueryClient } from "react-query";
import { useTranslation } from "react-i18next";

import ZModal from "@src/common/ZModal";
import backIcon from "@assets/images/backIcon.svg";

import { addFeeling } from "@src/api/FeelingsAPI";
import { getJustDate } from "@utils";
import { darkModeState } from "@store";
import { feelingsList, feelingsCategories, feelingsEmojis } from "@consts/FeelingsList";

import "@translations/i18n";

export const AddFeeling = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const date = new Date();

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
      date: Date.now(),
      note: feelingNote,
    });
    queryClient.invalidateQueries("feelings");
    navigate(-1);
  };
  return (
    <ZModal type={`notes-modal${darkModeStatus ? "-dark" : ""}`} open>
      {selectedCategory === "" ? (
        <>
          <p className="popupModal-title">
            {date.getTime() === getJustDate(new Date()).getTime()
              ? t("feelingsMessage")
              : `${t("feelingsMessagePast")} ${date.toDateString()}`}
          </p>
          <div className="d-flex f-col gap-8">
            {feelingsCategories.map((category: string) => (
              <Row key={`feeling-${category}`} className="feelings-category br-8">
                <Col span={20}>
                  <button
                    className="simple w-100 fw-400"
                    type="button"
                    style={{ textAlign: "left" }}
                    onClick={async () => {
                      await addThisFeeling(category);
                    }}
                  >
                    {feelingsEmojis[category]}&nbsp;&nbsp;
                    {t(category)}
                  </button>
                </Col>
                <Col span={4}>
                  <button
                    className="simple w-100 fw-400"
                    type="button"
                    onClick={() => {
                      setSelectedCategory(category);
                    }}
                  >
                    <img alt="add feeling" src={backIcon} className="chevronRight theme-icon" />
                  </button>
                </Col>
              </Row>
            ))}
          </div>
        </>
      ) : (
        <div className="d-flex f-col gap-16">
          <p className="popupModal-title">{`You feel ${
            customFeeling.text === "" ? t(feelingsList[selectedCategory][customFeeling.emojiIndx]) : customFeeling.text
          }`}</p>
          <div className="f-wrap gap-8">
            {selectedCategory !== "" &&
              feelingsList[selectedCategory].map((feeling, index) => (
                <button
                  type="button"
                  className={`br-8 feelingOption${customFeeling.emojiIndx === index ? "-selected" : ""}`}
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
