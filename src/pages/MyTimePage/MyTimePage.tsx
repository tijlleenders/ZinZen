/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-relative-packages */
// @ts-nocheck
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";

import { darkModeState } from "@src/store";
import { ITask } from "@src/Interfaces/Task";
import { GoalItem } from "@src/models/GoalItem";
import { colorPalleteList, getDiffInHours } from "@src/utils";
import { TaskFilter } from "@src/helpers/TaskFilter/TaskFilter";
import { MyTimeline } from "@components/MyTimeComponents/MyTimeline";
import { addStarterGoal, starterGoals } from "@src/constants/starterGoals";
import { checkMagicGoal, getActiveGoals, getAllGoals } from "@src/api/GoalsAPI";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

import init, { schedule } from "../../../pkg/scheduler";
import "./MyTimePage.scss";
import "@translations/i18n";

export const MyTimePage = () => {
  const toggle = false;
  const today = new Date();
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [goalOfMaxDuration, setGoalOfMaxDuration] = useState(0);
  const [tasks, setTasks] = useState<{[day: string]: ITask[]}>({});
  const [showTasks, setShowTasks] = useState<string[]>(["Today"]);
  const [unplannedIndices, setUnplannedIndices] = useState<number[]>([]);
  const [maxDurationOfUnplanned, setMaxDurationOfUnplanned] = useState(0);
  const [colorBands, setColorBands] = useState<{[day: string]: number}>({});
  const [unplannedDurations, setUnplannedDurations] = useState<number[]>([]);
  const [impossibleTasks, setImpossibleTasks] = useState<{[day: string]: ITask[]}>({});
  const handleShowTasks = (dayName: string) => {
    if (showTasks.includes(dayName)) {
      setShowTasks([...showTasks.filter((day: string) => day !== dayName)]);
    } else { setShowTasks([...showTasks, dayName]); }
  };
  const getColorWidth = (day:string, unplanned: boolean, duration: number) => {
    if (!toggle) return (duration * (100 / (tasks[day].length)));
    let colorWidth = 0;
    if (unplanned && duration > goalOfMaxDuration) {
      colorWidth = (goalOfMaxDuration + 1) * 4.17;
    } else {
      colorWidth = (duration * 4.17) + (maxDurationOfUnplanned - 1 - goalOfMaxDuration) * 4.17;
    }
    return colorWidth;
  };

  const getColorComponent = (colorWidth:number, color: string) => (
    <div
      style={{
        width: `${colorWidth}%`,
        height: "10px",
        backgroundColor: `${color}`
      }}
    />
  );
  const getTimeline = (day: string) => (
    tasks[day] ? <MyTimeline myTasks={tasks[day]} impossible={impossibleTasks[day] || []} /> : <div />
  );
  const getDayComponent = (day: string) => {
    let colorIndex = -1;
    return (
      <div key={day} className={`MyTime_day-${darkModeStatus ? "dark" : "light"}`}>
        <button
          type="button"
          className="MyTime_navRow"
          style={showTasks.includes(day) ? { boxShadow: `0px 2px 3px rgba(${darkModeStatus ? "255, 255, 255" : "0, 0, 0"}, 0.25)` } : {}}
          onClick={() => {
            handleShowTasks(day);
          }}
        >
          <h3 className="MyTime_dayTitle"> {day === "Today" ? `My ${today.toDateString()}` : day}</h3>
          <button
            className={`MyTime-expand-btw${darkModeStatus ? "-dark" : ""}`}
            type="button"
          >
            <div> { showTasks.includes(day) ? <ChevronDown /> : <ChevronRight /> } </div>
          </button>
        </button>
        {showTasks.includes(day) ? getTimeline(day) :
          (
            <div className="MyTime_colorPalette">
              {tasks[day]?.map((task, index) => {
                const colorWidth = getColorWidth(day, false, task.duration);
                colorIndex = (colorIndex === colorPalleteList.length - 1) ? 0 : colorIndex + 1;
                return getColorComponent((colorBands[day] / tasks[day].length) * 100, task.goalColor);
              })}
            </div>
          )}
      </div>
    );
  };

  const createDummyGoals = async () => {
    starterGoals.forEach(async (goal) => {
      addStarterGoal(t(goal.title), goal.goalTags)
        .catch((error) => { console.log(error, goal); });
    });
  };

  const handleSchedulerOutput = (_schedulerOutput, activeGoals:GoalItem[]) => {
    const schedulerOutput = [..._schedulerOutput];
    schedulerOutput.forEach((ele, index) => {
      activeGoals.forEach((tmpGoal, ind) => {
        if (tmpGoal.id === ele.goalid) {
          schedulerOutput[index].parentGoalId = activeGoals[ind].parentGoalId;
          schedulerOutput[index].goalColor = activeGoals[ind].goalColor;
        }
      });
    });
    const _today = new Date();
    const temp = { };
    temp.Today = TaskFilter(schedulerOutput, 0);
    temp.Tomorrow = TaskFilter(schedulerOutput, 1);
    [...Array(5).keys()].forEach((ind) => {
      _today.setDate(_today.getDate() + 1);
      temp[`${_today.toLocaleDateString("en-us", { weekday: "long" })}`] = TaskFilter(schedulerOutput, ind + 2);
    });
    return temp;
  };
  useEffect(() => {
    (async () => {
      const devMode = await checkMagicGoal();
      let activeGoals: GoalItem[] = await (devMode ? getAllGoals() : getActiveGoals());
      if (activeGoals.length === 0) { await createDummyGoals(); activeGoals = await getActiveGoals(); }
      console.log(activeGoals);
      await init();
      const _today = new Date();
      const startDate = `${_today?.toISOString().slice(0, 10)}T00:00:00`;
      const endDate = `${new Date(_today.setDate(_today.getDate() + 7)).toISOString().slice(0, 10)}T00:00:00`;

      const schedulerInput = {
        startDate,
        endDate,
        goals: []
      };
      activeGoals = [...activeGoals.filter((ele) => (!!ele.duration && !devMode))];
      activeGoals.forEach((ele) => {
        const obj = { id: ele.id, title: ele.title };
        if (ele.duration) obj.duration = `${ele.duration}`;
        if (ele.start) obj.start = `${ele.start?.toISOString().slice(0, 10)}T${ele.start?.toTimeString().slice(0, 8)}`;
        if (ele.due) obj.deadline = `${ele.due?.toISOString().slice(0, 10)}T${ele.due?.toTimeString().slice(0, 8)}`;
        if (ele.afterTime) obj.after_time = ele.afterTime;
        if (ele.beforeTime) obj.before_time = ele.beforeTime;
        if (ele.repeat) obj.repeat = ele.repeat.toLowerCase();
        schedulerInput.goals.push(obj);
      });
      console.log("input", schedulerInput);
      const res = schedule(schedulerInput);
      console.log("output", res);
      const userTasks = handleSchedulerOutput(res.scheduled, activeGoals);
      const bandWidths = {};
      Object.keys(userTasks).forEach((day) => {
        let totalDuration = 0;
        userTasks[day].forEach((tsk: ITask) => { totalDuration += tsk.duration; });
        bandWidths[day] = totalDuration;
      });
      setColorBands({ ...bandWidths });
      setTasks({ ...userTasks });
      setImpossibleTasks({ ...handleSchedulerOutput(res.impossible, activeGoals) });
    })();
  }, []);

  return (
    <div className="slide MyTime_container">
      <MainHeaderDashboard />
      <div id="MyTime_days_container">
        {getDayComponent("Today")}
        {getDayComponent("Tomorrow")}
        {
          [...Array(5).keys()].map(() => {
            today.setDate(today.getDate() + 1);
            return getDayComponent(`${today.toLocaleDateString("en-us", { weekday: "long" })}`);
          })
        }
      </div>
    </div>
  );
};
