// @ts-nocheck
import React, { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

import addDark from "@assets/images/addDark.svg";
import addLight from "@assets/images/addLight.svg";
import { getAllFeelings } from "@api/FeelingsAPI";
import { getDates } from "@utils";
import { IFeelingItem } from "@models";
import { darkModeState } from "@store";
import { feelingListType } from "@src/global";
import AppLayout from "@src/layouts/AppLayout";
import { AddFeelingsPage } from "@pages/AddFeelingsPage/AddFeelingsPage";
import { ShowFeelingTemplate } from "./ShowFeelingTemplate";

import "./ShowFeelings.scss";

export const ShowFeelingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [feelingsList, setFeelingsList] = useState<feelingListType[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<number>();
  const [selectedDay, setSelectedDay] = useState(0);
  const [showAddFeelingsModal, setShowAddFeelingsModal] = useState<Date | null>(null);

  useEffect(() => {
    const getData = async () => {
      const allFeelings = await getAllFeelings();
      const feelingsByDates: feelingListType[] = allFeelings.reduce((dates: Date[], feeling: IFeelingItem) => {
        if (dates[feeling.date]) {
          dates[feeling.date].push(feeling);
        } else {
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
  const date = dateRangeArr[selectedDay];
  return (
    <AppLayout title="My Journal">
      <div>
        {feelingsList && (
          <div key={date}>
            <div style={{ display: "flex", justifyContent: "center", gap: 100, alignItems: "center", paddingTop: 10 }}>
              <ChevronLeft />
              <p style={{ padding: "15px 0" }} className={`feelings-date${darkModeStatus ? "-dark" : ""}`}>
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
              <ChevronRight />
            </div>
            {feelingsList[date] && feelingsList[date].length > 0 && (
            <ShowFeelingTemplate
              key={date}
              feelingsListObject={feelingsList[date]}
              setFeelingsListObject={{ feelingsList, setFeelingsList }}
              currentFeelingsList={feelingsList}
              handleFocus={{ selectedFeeling, setSelectedFeeling }}
            />
            )}
            {/* <button
              type="button"
              className={`addFeeling-btn${darkModeStatus ? "-dark" : ""}`}
              onClick={() => { setShowAddFeelingsModal(new Date(date)); }}
            >
              <img alt="add feeling" src={darkModeStatus ? addDark : addLight} />
            </button> */}
          </div>
        )}
      </div>
      <AddFeelingsPage feelingDate={showAddFeelingsModal} setShowAddFeelingsModal={setShowAddFeelingsModal} />
    </AppLayout>
  );
};
