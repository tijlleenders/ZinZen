// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import addIcon from "@assets/images/plus.svg";
import { getAllFeelings } from "@api/FeelingsAPI";
import { IFeelingItem } from "@models";
import { darkModeState } from "@store";
import { feelingListType } from "@src/global";
import { getDates } from "@utils";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { AddFeelingsPage } from "@pages/AddFeelingsPage/AddFeelingsPage";
import { ShowFeelingTemplate } from "./ShowFeelingTemplate";

import "./ShowFeelings.scss";

export const ShowFeelingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [feelingsList, setFeelingsList] = useState<feelingListType[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<number>();
  const [showAddFeelingsModal, setShowAddFeelingsModal] = useState<Date | null>(null);

  useEffect(() => {
    const getData = async () => {
      const allFeelings = await getAllFeelings();
      const feelingsByDates: feelingListType[] = allFeelings.reduce((dates: Date[], feeling: IFeelingItem) => {
        if (dates[feeling.date]) {
          dates[feeling.date].push(feeling);
        } else {
          // eslint-disable-next-line no-param-reassign
          dates[feeling.date] = [feeling];
        }
        return dates;
      }, {});
      setFeelingsList(feelingsByDates);
    };
    getData();
  }, [showAddFeelingsModal]);

  const dateArr = Object.keys(feelingsList).map((date) => date);
  const dateRangeArr = getDates(new Date(dateArr[0]), new Date()).reverse();
  if (dateRangeArr.length === 0) { dateRangeArr.push(new Date()); }
  return (
    <div id="myFeelings-container">
      <MainHeaderDashboard />
      <h1 id={`myFeelings-title${darkModeStatus ? "-dark" : ""}`}>
        {t("showfeelingsmessage")}
      </h1>
      {feelingsList &&
        dateRangeArr.map((date) => (
          <div key={date} className="show-feelings__list-category">
            <p className={`feelings-date${darkModeStatus ? "-dark" : ""}`}>
              <span
                role="button"
                tabIndex={0}
                onClick={() => {
                  navigate("/AddFeelings", {
                    state: { feelingDate: new Date(date) },
                  });
                }}
                onKeyDown={() => {
                  navigate("/AddFeelings", {
                    state: { feelingDate: new Date(date) },
                  });
                }}
                style={{ cursor: "pointer" }}
              >
                {new Date(date).toDateString() === new Date().toDateString()
                  ? "Today"
                  : new Date(date).toDateString()}
              </span>
            </p>
            {feelingsList[date] && feelingsList[date].length > 0 && (
              <ShowFeelingTemplate
                key={date}
                feelingsListObject={feelingsList[date]}
                setFeelingsListObject={{ feelingsList, setFeelingsList }}
                currentFeelingsList={feelingsList}
                handleFocus={{ selectedFeeling, setSelectedFeeling }}
              />
            )}
            <button
              type="button"
              className={`addFeeling-btn${darkModeStatus ? "-dark" : ""}`}
              onClick={() => { setShowAddFeelingsModal(new Date(date)); }}
            >
              <input
                type="image"
                tabIndex={0}
                key={date}
                src={addIcon}
                alt="add-feeling"
              />
            </button>

          </div>
        ))}
      <AddFeelingsPage feelingDate={showAddFeelingsModal} setShowAddFeelingsModal={setShowAddFeelingsModal} />
    </div>
  );
};
