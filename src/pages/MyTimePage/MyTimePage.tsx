import React, { useState } from "react";
import MyTimeline from "@components/MyTimeComponents/MyTimeline/MyTimeline";
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
import { Reminders } from "@components/MyTimeComponents/MyTimeline/Reminders/Reminders";

export const MyTimePage = () => {
  const today = new Date();
  const { tasks } = useScheduler();
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
    return (
      <div key={day} className="MyTime_day">
        <button
          type="button"
          className="MyTime_button"
          style={showTasks.includes(day) ? { background: "var(--bottom-nav-color)" } : {}}
          onClick={() => handleShowTasks(day)}
        >
          <div
            style={{
              background: "var(--bottom-nav-color)",
            }}
            className={`MyTime_navRow ${showTasks.includes(day) ? "selected" : ""}`}
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
            <div className="MyTime-expand-btw">
              <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
                {freeHours > 0 && <p>{`${freeHours} hours free`}</p>}
              </div>
            </div>
          </div>
          {tasks[day] && <ColorBands list={tasks[day]} />}
        </button>
        <div style={showTasks.includes(day) ? { background: "var(--bottom-nav-color)" } : {}}>
          {showTasks.includes(day) && tasks[day] && tasks[day].scheduled.length > 0 && (
            <div className="MyTime_dayList">
              <Reminders day={day} />
              <MyTimeline day={day} myTasks={tasks[day]} />
            </div>
          )}
        </div>
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
        {Object.keys(tasks).length === 0 ? (
          <div className="scheduling-message fw-600 text-lg place-middle">Auto-scheduling...</div>
        ) : (
          <>
            {getDayComponent("Today")}
            {getDayComponent("Tomorrow")}
            {[...Array(6).keys()].map((i) => {
              const thisDay = new Date(today);
              thisDay.setDate(thisDay.getDate() + i + 1);
              return i >= 1 ? getDayComponent(`${thisDay.toLocaleDateString("en-us", { weekday: "long" })}`) : null;
            })}
          </>
        )}
        <NotNowModal />
      </>
    </AppLayout>
  );
};
