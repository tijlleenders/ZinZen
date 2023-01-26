/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-relative-packages */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";
import { useRecoilValue } from "recoil";

import { getActiveGoals } from "@src/api/GoalsAPI";
import { addStarterGoal, starterGoals } from "@src/constants/starterGoals";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { MyTimeline } from "@components/MyTimeComponents/MyTimeline";
import { GoalItem } from "@src/models/GoalItem";

import { darkModeState } from "@src/store";
import { colorPallete, getDiffInHours } from "@src/utils";
import { ITask } from "@src/Interfaces/Task";
import { TaskFilter } from "@src/helpers/TaskFilter/TaskFilter";

import init, { schedule } from "../../../pkg/scheduler";
import "./MyTimePage.scss";

export const MyTimePage = () => {
  const toggle = true;
  const today = new Date();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [tasks, setTasks] = useState<{[day: string]: ITask[]}>({});
  const [goalOfMaxDuration, setGoalOfMaxDuration] = useState(0);
  const [maxDurationOfUnplanned, setMaxDurationOfUnplanned] = useState(0);
  const [unplannedIndices, setUnplannedIndices] = useState<number[]>([]);
  const [unplannedDurations, setUnplannedDurations] = useState<number[]>([]);
  const [showTasks, setShowTasks] = useState<string[]>(["Today"]);

  const handleShowTasks = (dayName: string) => {
    if (showTasks.includes(dayName)) {
      setShowTasks([...showTasks.filter((day: string) => day !== dayName)]);
    } else { setShowTasks([...showTasks, dayName]); }
  };
  const getColorWidth = (unplanned: boolean, duration: number) => {
    if (!toggle) return (duration * 4.17);
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
    tasks[day] ? <MyTimeline myTasks={tasks[day]} /> : <div />
  );
  const getDayComponent = (day: string) => {
    let colorIndex = -1;
    return (
      <div key={day} className={`MyTime_day-${darkModeStatus ? "dark" : "light"}`}>
        <button
          type="button"
          className="MyTime_navRow"
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
                const colorWidth = getColorWidth(false, task.duration);
                colorIndex = (colorIndex === colorPallete.length - 1) ? 0 : colorIndex + 1;
                if (unplannedIndices.includes(index)) {
                  const unpColorWidth = getColorWidth(true, unplannedDurations[unplannedIndices.indexOf(index)]);
                  if (index === 0) {
                    return (
                      <>
                        {getColorComponent(unpColorWidth, "lightgray")}
                        {getColorComponent(colorWidth, task.goalColor)}
                      </>
                    );
                  }
                  return (
                    <>
                      {getColorComponent(colorWidth, task.goalColor)}
                      {getColorComponent(unpColorWidth, "lightgray")}
                    </>
                  );
                }
                return (getColorComponent(colorWidth, task.goalColor));
              })}
            </div>
          )}
      </div>
    );
  };

  const getTasks = async () => {
    const goals: GoalItem[] = await getActiveGoals();
    let GMD = goals[0].duration;
    let MDU = goals[0].duration;
    let prev = new Date(goals[0].due ? goals[0].due : new Date());
    prev = new Date(prev.setHours(0));
    const unplannedInd :number[] = [];
    const unplannedDur :number[] = [];
    goals.map((goal, index) => {
      const diff = getDiffInHours(goal.start ? goal.start : new Date(), prev);
      prev = new Date(goal.due ? goal.due : new Date());
      if (diff > 0) {
        unplannedInd.push(index - 1);
        unplannedDur.push(diff);
        MDU = MDU < diff ? diff : MDU;
      }
      if (GMD < goal.duration) GMD = goal.duration;
      return null;
    });
    unplannedInd[0] = unplannedInd[0] === -1 ? 0 : unplannedInd[0];
    setUnplannedDurations([...unplannedDur]);
    setUnplannedIndices([...unplannedInd]);
    setGoalOfMaxDuration(GMD);
    setMaxDurationOfUnplanned(MDU);
    return goals;
  };

  const createDummyGoals = async () => {
    starterGoals.forEach(async (goal) => {
      try {
        await addStarterGoal(goal.title, goal.goalTags);
      } catch (error) {
        console.log(error, goal);
      }
    });
  };

  useEffect(() => {
    (async () => {
      // get goals
      let activeGoals: GoalItem[] = await getActiveGoals();
      // if goals doesn't exist create dummy goals
      if (activeGoals.length === 0) { await createDummyGoals(); }

      activeGoals = await getTasks();
      console.log(activeGoals);
      await init();
      let _today = new Date();
      const startDate = `${_today?.toISOString().slice(0, 10)}T00:00:00`;
      const endDate = `${new Date(_today.setDate(_today.getDate() + 7)).toISOString().slice(0, 10)}T00:00:00`;

      const schedulerInput = {
        startDate,
        endDate,
        goals: []
      };
      activeGoals = [...activeGoals.filter((ele) => (!!ele.duration))];
      activeGoals.forEach((ele) => {
        const obj = {
          id: ele.id,
          title: ele.title,
          duration: `${ele.duration}`
        };
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
      const schedulerOutput = res.scheduled;
      schedulerOutput.forEach((ele, index) => {
        activeGoals.forEach((tmpGoal, ind) => {
          if (tmpGoal.id === ele.goalid) {
            schedulerOutput[index].parentGoalId = activeGoals[ind].parentGoalId;
            schedulerOutput[index].goalColor = activeGoals[ind].goalColor;
          }
        });
      });
      _today = new Date();
      tasks.Today = TaskFilter(schedulerOutput, 0);
      tasks.Tomorrow = TaskFilter(schedulerOutput, 1);
      [...Array(5).keys()].forEach((ind) => {
        _today.setDate(_today.getDate() + 1);
        tasks[`${_today.toLocaleDateString("en-us", { weekday: "long" })}`] = TaskFilter(schedulerOutput, ind + 2);
      });
      console.log(tasks);
      setTasks({ ...tasks });
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
