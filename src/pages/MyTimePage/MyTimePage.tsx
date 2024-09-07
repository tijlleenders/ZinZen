import React, { useState } from "react";

import { MyTimeline } from "@components/MyTimeComponents/MyTimeline/MyTimeline";
import { Focus } from "@components/MyTimeComponents/Focus.tsx/Focus";

import { getOrdinalSuffix } from "@src/utils";
import SubHeader from "@src/common/SubHeader";
import AppLayout from "@src/layouts/AppLayout";
import ColorBands from "@components/MyTimeComponents/ColorBands";
import useScheduler from "@src/hooks/useScheduler";

import "./MyTimePage.scss";
import "@translations/i18n";
import { useLocation, useSearchParams } from "react-router-dom";
import { Row } from "antd";
import SchedulerErrorModal from "@components/MyTimeComponents/SchedulerErrorModal";
import NotNowModal from "@components/MyTimeComponents/NotNow/NotNowModal";
import ConfigGoal from "@components/GoalsComponents/GoalConfigModal/ConfigGoal";
import { TGoalCategory } from "@src/models/GoalItem";
import { goalCategories } from "@src/constants/goals";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import classNames from "classnames";

export const MyTimePage = () => {
  const today = new Date();
  const { tasks, tasksStatus, setTasksStatus } = useScheduler();
  const [showTasks, setShowTasks] = useState<string[]>(["Today"]);
  const { state } = useLocation();

  const [searchParams] = useSearchParams();

  const goalType = (searchParams.get("type") as TGoalCategory) || "";

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
    const isActive = showTasks.includes(day);
    return (
      <div key={day} className="MyTime_day-container">
        <button type="button" className="MyTime_button" onClick={() => handleShowTasks(day)}>
          <div className={`MyTime_header ${showTasks.includes(day) ? "selected" : ""}`}>
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
            {freeHours > 0 && <p className="MyTime-free-hours-text">{`${freeHours} hours free`}</p>}
          </div>
          {tasks[day] && (
            <ColorBands list={tasks[day]} day={day} tasksStatus={tasksStatus} active={showTasks.includes(day)} />
          )}
        </button>
        {isActive && tasks[day] ? (
          <MyTimeline day={day} myTasks={tasks[day]} taskDetails={tasksStatus} setTaskDetails={setTasksStatus} />
        ) : (
          <div />
        )}
      </div>
    );
  };

  if (state?.displayFocus) {
    return (
      <AppLayout title="myTime">
        <SubHeader title="Focus" />
        <Focus />
      </AppLayout>
    );
  }

  return (
    <AppLayout title="myTime">
      <>
        <SchedulerErrorModal />
        {goalCategories.includes(goalType) && (
          <ConfigGoal type={goalType} goal={createGoalObjectFromTags()} mode="add" />
        )}
        <Row />
        {getDayComponent("Today")}
        {getDayComponent("Tomorrow")}
        {[...Array(6).keys()].map((i) => {
          const thisDay = new Date(today);
          thisDay.setDate(thisDay.getDate() + i + 1);
          return i >= 1 ? getDayComponent(`${thisDay.toLocaleDateString("en-us", { weekday: "long" })}`) : null;
        })}
        <NotNowModal />
      </>
    </AppLayout>
  );
};
