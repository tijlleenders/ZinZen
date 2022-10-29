/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-relative-packages */
// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";

import { addGoal, createGoal, getActiveGoals } from "@src/api/GoalsAPI";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { MyTimeline } from "@components/MyTimeComponents/MyTimeline";
import { GoalItem } from "@src/models/GoalItem";
import { colorPallete, getDiffInHours } from "@src/utils";
import { ISchedulerInputGoal } from "@src/Interfaces/ISchedulerInputGoal";

import init, { schedule } from "../../../pkg/scheduler";

import "./MyTimePage.scss";

export const MyTimePage = () => {
  const today = new Date();
  const [tmpTasks, setTmpTasks] = useState<GoalItem[]>([]);
  const [goalOfMaxDuration, setGoalOfMaxDuration] = useState(0);
  const [maxDurationOfUnplanned, setMaxDurationOfUnplanned] = useState(0);
  const [unplannedIndices, setUnplannedIndices] = useState<number[]>([]);
  const [unplannedDurations, setUnplannedDurations] = useState<number[]>([]);
  const [showTasks, setShowTasks] = useState<string[]>([`My ${today.toDateString()}`]);
  const toggle = true;

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

  const getColorComponent = (id: number|undefined|string, colorWidth:number, color: string) => (
    <div
      key={`task-${id}`}
      style={{
        width: `${colorWidth}%`,
        height: "10px",
        backgroundColor: `${color}`
      }}
    />
  );
  const getTimeline = () => (<MyTimeline myTasks={tmpTasks} />);
  const getDayComponent = (day: string) => {
    let colorIndex = -1;
    return (
      <div key={`day-${day}`} className="MyTime_day">
        <button
          type="button"
          className="MyTime_navRow"
          onClick={() => {
            handleShowTasks(day);
          }}
        >
          <h3 className="MyTime_dayTitle"> {day} </h3>
          <button
            className="MyTime-expand-btw"
            type="button"
          >
            <div> { showTasks.includes(day) ? <ChevronDown /> : <ChevronRight /> } </div>
          </button>
        </button>
        {showTasks.includes(day) ? getTimeline() :
          (
            <div className="MyTime_colorPalette">
              {tmpTasks.map((task, index) => {
                const colorWidth = getColorWidth(false, task.duration);
                colorIndex = (colorIndex === colorPallete.length - 1) ? 0 : colorIndex + 1;
                if (unplannedIndices.includes(index)) {
                  const unpColorWidth = getColorWidth(true, unplannedDurations[unplannedIndices.indexOf(index)]);
                  if (index === 0) {
                    return (
                      <>
                        {getColorComponent(`U-${day}-${index}`, unpColorWidth, "lightgray")}
                        {getColorComponent(`task-${day}-${task.id}`, colorWidth, task.goalColor ? task.goalColor : colorPallete[0])}
                      </>
                    );
                  }
                  return (
                    <>
                      {getColorComponent(`task-${day}-${task.id}`, colorWidth, task.goalColor ? task.goalColor : colorPallete[0])}
                      {getColorComponent(`U-${day}-${index}`, unpColorWidth, "lightgray")}
                    </>
                  );
                }
                return (getColorComponent(`task-${day}-${task.id}`, colorWidth, task.goalColor ? task.goalColor : colorPallete[0]));
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
    let prev = new Date(goals[0].finish ? goals[0].finish : new Date());
    prev = new Date(prev.setHours(0));
    const unplannedInd :number[] = [];
    const unplannedDur :number[] = [];
    goals.map((goal, index) => {
      const diff = getDiffInHours(goal.start ? goal.start : new Date(), prev);
      prev = new Date(goal.finish ? goal.finish : new Date());
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
    const dummyTitles = ["Shopping", "Dentist", "Exercise"];
    const dummyDates = [[10, 13], [10, 11], [10, 18]];
    [...Array(3).keys()].forEach(async (ele) => {
      const dummyGoal = createGoal(
        dummyTitles[ele],
        "Daily",
        1,
        new Date(new Date().setHours(dummyDates[ele][0], 0, 0)),
        new Date(new Date().setHours(dummyDates[ele][1], 0, 0)),
        [ele][0],
        [ele][1],
        0,
        -1,
        "#B2A24D",
        "English",
        null
      );
      const id = await addGoal(dummyGoal);
      return id;
    });
  };

  const createInputGoals = (goals: GoalItem[]) => {
    const arr : ISchedulerInputGoal[] = [];
    goals.forEach((element) => {
      arr.push({
        id: element.id,
        title: element.title,
        duration: element.duration,
        start: element.start.toISOString().split(".")[0],
        deadline: element.due.toISOString().split(".")[0]
      });
    });
    console.log(arr);
    return arr;
  };

  useEffect(() => {
    (async () => {
      // get goals
      let activeGoals: GoalItem[] = await getActiveGoals();
      // if goals doesn't exist create dummy goals
      if (activeGoals.length === 0) { await createDummyGoals(); }

      activeGoals = await getTasks();
      console.log(activeGoals);
      const scheduler = await init();
      const _today = new Date();
      const startDate = `${_today?.toISOString().slice(0, 10)}T00:00:00`;
      const endDate = `${new Date(_today.setDate(_today.getDate() + 1)).toISOString().slice(0, 10)}T00:00:00`;

      const schedulerInput = {
        startDate,
        endDate,
        goals: []
      };
      activeGoals.forEach((ele) => {
        schedulerInput.goals.push({
          id: ele.id,
          title: ele.title,
          duration: ele.duration,
          start: startDate,
          deadline: endDate,
          after_time: ele.startTime || ele.start?.getHours() || 0,
          before_time: ele.endTime || ele.due?.getHours() || 0
        });
      });
      console.log(schedulerInput);
      const schedulerOutput = schedule(schedulerInput);
      const slotTaskMap = {};
      schedulerOutput.forEach((element) => {
        const ind = activeGoals.findIndex((tmpGoal) => tmpGoal.id === element.goalid);
        const poppedGoal = activeGoals.splice(ind, 1)[0];
        activeGoals = [...activeGoals, poppedGoal];
      });
      setTmpTasks([...activeGoals]);
      console.log(schedulerOutput);
    })();
  }, []);

  return (
    <div>
      <Container fluid>
        <Row>
          <MainHeaderDashboard />
        </Row>
      </Container>
      <div className="slide MyTime_container">
        <div id="MyTime_days_container">
          {getDayComponent(`My ${today.toDateString()}`)}
          {getDayComponent("Tomorrow")}
          {
            [...Array(5).keys()].map(() => {
              today.setDate(today.getDate() + 1);
              return getDayComponent(`${today.toLocaleDateString("en-us", { weekday: "long" })}`);
            })
          }
        </div>
      </div>
    </div>
  );
};
