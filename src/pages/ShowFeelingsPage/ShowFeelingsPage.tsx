import React from "react";
import { useRecoilValue } from "recoil";

import AppLayout from "@src/layouts/AppLayout";
import SubHeader from "@src/common/SubHeader";
import { displayAddFeeling } from "@src/store/FeelingsState";
import { AddFeeling } from "@components/FeelingsComponents/AddFeeling";

import { ShowFeelingTemplate } from "./ShowFeelingTemplate";

import "./ShowFeelings.scss";
import useFeelingsData from "./useFeelingsData";

export const ShowFeelingsPage = () => {
  const showAddFeelingsModal = useRecoilValue(displayAddFeeling);
  const { feelingsList, setFeelingsList } = useFeelingsData(showAddFeelingsModal);

  const isToday = (date: string) => {
    return new Date(date).toDateString() === new Date().toDateString();
  };

  const isYesterday = (date: string) => {
    return new Date(date).toDateString() === new Date(new Date().setDate(new Date().getDate() - 1)).toDateString();
  };

  const formatSubheaderDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTitleForDate = (date: string) => {
    if (isToday(date)) {
      return "Today";
    }
    if (isYesterday(date)) {
      return "Yesterday";
    }
    return formatSubheaderDate(date);
  };

  return (
    <AppLayout title="myJournal">
      <div>
        {Object.entries(feelingsList).map(([date]) => (
          <div key={date}>
            {feelingsList[date] && (
              <SubHeader
                title={getTitleForDate(date)}
                leftNav={() => {
                  return null;
                }}
                rightNav={() => {
                  return null;
                }}
                showLeftNav={false}
                showRightNav={false}
              />
            )}
            <ShowFeelingTemplate
              key={date}
              feelingsListObject={feelingsList[date]}
              setFeelingsListObject={{ feelingsList, setFeelingsList }}
              currentFeelingsList={feelingsList}
            />
          </div>
        ))}
      </div>
      {showAddFeelingsModal && <AddFeeling feelingDate={new Date()} />}
    </AppLayout>
  );
};
