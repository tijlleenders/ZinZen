/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import { useRecoilValue } from "recoil";

import { MyTimeline } from "@components/MyTimeComponents/MyTimeline";
import { darkModeState } from "@src/store";
import { getOrdinalSuffix } from "@src/utils";
import SubHeader from "@src/common/SubHeader";
import AppLayout from "@src/layouts/AppLayout";
import ColorBands from "@components/MyTimeComponents/ColorBands";
import Reschedule from "@components/MyTimeComponents/Reschedule/Reschedule";
import useScheduler from "@src/hooks/useScheduler";

import "./MyTimePage.scss";
import "@translations/i18n";
import { displayReschedule } from "@src/store/TaskState";

export const MyTimePage = () => {
  const today = new Date();
  const { tasks, tasksStatus, setTasksStatus } = useScheduler();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [dailyView, setDailyView] = useState(false);
  const [showTasks, setShowTasks] = useState<string[]>(["Today"]);
  const openReschedule = useRecoilValue(displayReschedule);

  const handleShowTasks = (dayName: string) => {
    if (showTasks.includes(dayName)) {
      setShowTasks([...showTasks.filter((day: string) => day !== dayName)]);
    } else {
      setShowTasks([...showTasks, dayName]);
    }
  };

  const getDayComponent = (day: string) => {
    const freeHours = tasks[day]?.freeHrsOfDay;
    const dayOfMonth = today.getDate();
    const suffix = getOrdinalSuffix(dayOfMonth);
    return (
      <div key={day} className="MyTime_day">
        <button
          type="button"
          className={`MyTime_navRow ${showTasks.includes(day) ? "selected" : ""}`}
          style={
            showTasks.includes(day)
              ? { boxShadow: `0px 1px 3px rgba(${darkModeStatus ? "255, 255, 255" : "0, 0, 0"}, 0.25)` }
              : {}
          }
          onClick={() => {
            handleShowTasks(day);
          }}
        >
          <h3 className="MyTime_dayTitle">
            {day === "Today" ? (
              <>
                {today.toLocaleString("default", { weekday: "long" })} {dayOfMonth}
                <sup>{suffix}</sup>
              </>
            ) : (
              day
            )}
          </h3>
          <button className="MyTime-expand-btw" type="button">
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <p>{`${freeHours || ""} hours free`}</p>
            </div>
          </button>
        </button>
        <div style={showTasks.includes(day) ? { background: "var(--bottom-nav-color)" } : {}}>
          {tasks[day] && (
            <ColorBands list={tasks[day]} day={day} tasksStatus={tasksStatus} active={showTasks.includes(day)} />
          )}
          {showTasks.includes(day) && tasks[day] ? (
            <MyTimeline day={day} myTasks={tasks[day]} taskDetails={tasksStatus} setTaskDetails={setTasksStatus} />
          ) : (
            <div />
          )}
        </div>
      </div>
    );
  };

  return (
    <AppLayout title="My Time">
      <SubHeader
        showLeftNav={!dailyView}
        showRightNav={dailyView}
        title={dailyView ? "Today" : "This Week"}
        leftNav={() => {
          setDailyView(!dailyView);
        }}
        rightNav={() => {
          setDailyView(!dailyView);
        }}
      />
      {getDayComponent("Today")}
      {!dailyView && getDayComponent("Tomorrow")}
      {!dailyView &&
        [...Array(6).keys()].map((i) => {
          const thisDay = new Date(today);
          thisDay.setDate(thisDay.getDate() + i + 1);
          if (i >= 1) {
            return getDayComponent(`${thisDay.toLocaleDateString("en-us", { weekday: "long" })}`);
          }
          return null;
        })}
      {openReschedule && <Reschedule />}
    </AppLayout>
  );
};
