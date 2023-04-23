import React, { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import { ChevronLeft, ChevronRight } from "react-bootstrap-icons";

import { getAllFeelings } from "@api/FeelingsAPI";
import { getDates } from "@utils";
import { IFeelingItem } from "@models";
import { darkModeState, displayToast } from "@store";
import { feelingListType } from "@src/global";
import AppLayout from "@src/layouts/AppLayout";
import { AddFeelingsPage } from "@pages/AddFeelingsPage/AddFeelingsPage";
import { displayAddFeeling } from "@src/store/FeelingsState";
import { ShowFeelingTemplate } from "./ShowFeelingTemplate";

import "./ShowFeelings.scss";

export const ShowFeelingsPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const showAddFeelingsModal = useRecoilValue(displayAddFeeling);

  const setShowToast = useSetRecoilState(displayToast);

  const [selectedDate, setSelectedDate] = useState(0);
  const [feelingsList, setFeelingsList] = useState<feelingListType[]>([]);
  const [journalDates, setJournalDates] = useState<Date[]>([]);

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
      const dateArr = Object.keys(feelingsByDates).map((date) => date);
      const dateRangeArr = getDates(new Date(dateArr[0]), new Date());
      if (dateRangeArr.length === 0) { dateRangeArr.push(new Date()); }
      setJournalDates([...dateRangeArr]);
      setSelectedDate(dateRangeArr.length - 1);
      setFeelingsList(feelingsByDates);
    };
    getData();
  }, [showAddFeelingsModal]);

  const handleNavigation = (direction: "left" | "right") => {
    if (direction === "left") {
      if (selectedDate > 0) {
        setSelectedDate(selectedDate - 1);
      } else {
        setShowToast({ open: true, message: "Let past rest in past.", extra: "" });
      }
    } else if (selectedDate + 1 < journalDates.length) {
      setSelectedDate(selectedDate + 1);
    } else {
      setShowToast({ open: true, message: "Shall we wait for that day?", extra: "" });
    }
  };
  const date = journalDates.length > 0 ? journalDates[selectedDate] : null;
  return (
    <AppLayout title="My Journal">
      <div>
        {feelingsList && date && (
          <div key={date}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", paddingTop: 10 }}>
              <ChevronLeft style={{ flex: 1 }} onClick={() => { handleNavigation("left"); }} />
              <p style={{ padding: "15px 0", margin: "0px 15px", flex: 2 }} className={`feelings-date${darkModeStatus ? "-dark" : ""}`}>
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
              <ChevronRight style={{ flex: 1 }} onClick={() => { handleNavigation("right"); }} />
            </div>
            {feelingsList[date] && feelingsList[date].length > 0 && (
            <ShowFeelingTemplate
              key={date}
              feelingsListObject={feelingsList[date]}
              setFeelingsListObject={{ feelingsList, setFeelingsList }}
              currentFeelingsList={feelingsList}
            />
            )}
          </div>
        )}
      </div>
      {showAddFeelingsModal && <AddFeelingsPage feelingDate={new Date()} />}
    </AppLayout>
  );
};
