import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { ChevronDown, ChevronRight } from "react-bootstrap-icons";

import { addGoal, createGoal, getActiveGoals } from "@src/api/GoalsAPI";
import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { MyTimeline } from "@components/MyTimeComponents/MyTimeline";
import { GoalItem } from "@src/models/GoalItem";
import { getDiffInHours, weekday } from "@src/utils";

import "./MyTimePage.scss";

export const MyTimePage = () => {
  const [tmpTasks, setTmpTasks] = useState<GoalItem[]>([]);
  const [goalOfMaxDuration, setGoalOfMaxDuration] = useState(0);
  const [maxDurationOfUnplanned, setMaxDurationOfUnplanned] = useState(0);
  const [unplannedIndices, setUnplannedIndices] = useState<number[]>([]);
  const [unplannedDurations, setUnplannedDurations] = useState<number[]>([]);
  const [showTasks, setShowTasks] = useState<string[]>([]);
  const toggle = true;

  const today = new Date();
  today.setDate(today.getDate() + 1);

  const darkrooms = ["#443027", "#9C4663", "#2B517B", "#612854"];

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
  const getTimeline = () => (
    <MyTimeline myTasks={tmpTasks} />
  );
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
                colorIndex = (colorIndex === darkrooms.length - 1) ? 0 : colorIndex + 1;
                if (unplannedIndices.includes(index)) {
                  const unpColorWidth = getColorWidth(true, unplannedDurations[unplannedIndices.indexOf(index)]);
                  if (index === 0) {
                    return (
                      <>
                        {getColorComponent(`U-${day}-${index}`, unpColorWidth, "lightgray")}
                        {getColorComponent(`task-${day}-${task.id}`, colorWidth, task.goalColor ? task.goalColor : darkrooms[0])}
                      </>
                    );
                  }
                  return (
                    <>
                      {getColorComponent(`task-${day}-${task.id}`, colorWidth, task.goalColor ? task.goalColor : darkrooms[0])}
                      {getColorComponent(`U-${day}-${index}`, unpColorWidth, "lightgray")}
                    </>
                  );
                }
                return (getColorComponent(`task-${day}-${task.id}`, colorWidth, task.goalColor ? task.goalColor : darkrooms[0]));
              })}
            </div>
          )}
      </div>
    );
  };

  useEffect(() => {
    (async () => {
      const createDummyGoals = async () => {
        let start = 0;
        let end = 0;
        let tmpColor = 0;
        const dummyNames: string[] = ["Unplanned", "Gym", "Study", "Unplanned", "Shopping", "Code Reviews", "Unplanned", "Algo Practice"];
        const dummyDurations : number[] = [4, 3, 1, 2, 3, 2, 6, 3];
        dummyNames.map(async (goalName, index) => {
          end = start + dummyDurations[index];
          if (goalName === "Unplanned") {
            start = end;
            return null;
          }
          const dummyGoal = createGoal(
            goalName,
            true,
            dummyDurations[index],
            new Date(new Date().setHours(start, 0, 0)),
            new Date(new Date().setHours(end, 0, 0)),
            0,
            -1,
            darkrooms[tmpColor]
          );
          tmpColor = tmpColor === darkrooms.length - 1 ? 0 : tmpColor + 1;

          start = end;
          const id = await addGoal(dummyGoal);
          return id;
        });
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
      let tasks: GoalItem[] = await getActiveGoals();
      if (tasks.length === 0) {
        await createDummyGoals();
      }
      tasks = await getTasks();

      setTmpTasks([...tasks]);
    })();
  }, []);

  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
      </Container>
      <div className="slide MyTime_container">
        <h1 id="MyTime_title">My Time</h1>
        <div id="MyTime_days_container">
          {getDayComponent("Today")}
          {getDayComponent("Tomorrow")}
          {
            [...Array(5).keys()].map(() => {
              today.setDate(today.getDate() + 1);
              return getDayComponent(`${weekday[today.getDay()]}`);
            })
          }
        </div>
      </div>
    </div>
  );
};
