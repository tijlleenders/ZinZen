/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-relative-packages */
// @ts-nocheck
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";

import chevronLeftIcon from "@assets/images/chevronLeft.svg";

import { ITask } from "@src/Interfaces/Task";
import { GoalItem } from "@src/models/GoalItem";
import { getAllTasks } from "@src/api/TasksAPI";
import { TaskItem } from "@src/models/TaskItem";
import { darkModeState, lastAction } from "@src/store";
import { MyTimeline } from "@components/MyTimeComponents/MyTimeline";
import { addStarterGoal, starterGoals } from "@src/constants/starterGoals";
import { checkMagicGoal, getActiveGoals, getAllGoals } from "@src/api/GoalsAPI";
import { colorPalleteList, getDiffInHours, getOrdinalSuffix } from "@src/utils";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import AppLayout from "@src/layouts/AppLayout";
import SubHeader from "@src/common/SubHeader";

import init, { schedule } from "../../../pkg/scheduler";
import "./MyTimePage.scss";
import "@translations/i18n";

export const MyTimePage = () => {
  const fakeThursday = new Date();
  fakeThursday.setDate(fakeThursday.getDate() + (fakeThursday.getDate() === 28 ? 2 : 1));
  const today = new Date();

  const { t } = useTranslation();
  const action = useRecoilValue(lastAction);
  const darkModeStatus = useRecoilValue(darkModeState);

  const [tasks, setTasks] = useState<{[day: string]: { scheduled: ITask[], impossible: ITask[], freeHrsOfDay: number, scheduledHrs: number, colorBands: { colorWidth: number, color: string } }}>({});
  const [devMode, setDevMode] = useState(false);
  const [dailyView, setDailyView] = useState(false);
  const [showTasks, setShowTasks] = useState<string[]>(["Today"]);
  const [colorBands, setColorBands] = useState<{[day: string]: number}>({});
  const [tasksStatus, setTasksStatus] = useState<{[goalId: string]: TaskItem}>({});
  const [impossibleTasks, setImpossibleTasks] = useState<{[day: string]: ITask[]}>({});
  const [unplannedIndices, setUnplannedIndices] = useState<number[]>([]);
  const [goalOfMaxDuration, setGoalOfMaxDuration] = useState(0);
  const [unplannedDurations, setUnplannedDurations] = useState<number[]>([]);
  const [maxDurationOfUnplanned, setMaxDurationOfUnplanned] = useState(0);

  const handleShowTasks = (dayName: string) => {
    if (showTasks.includes(dayName)) {
      setShowTasks([...showTasks.filter((day: string) => day !== dayName)]);
    } else { setShowTasks([...showTasks, dayName]); }
  };
  const getColorWidth = (duration: number, totalSlots: number) => (duration * (100 / (totalSlots)));

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
    tasks[day] ? <MyTimeline day={day} myTasks={tasks[day]} taskDetails={tasksStatus} setTaskDetails={setTasksStatus} /> : <div />
  );
  const getDayComponent = (day: string) => {
    const colorIndex = -1;
    const freeHours = tasks[day]?.freeHrsOfDay;
    const dayOfMonth = devMode ? fakeThursday.getDate() : today.getDate();
    const suffix = getOrdinalSuffix(dayOfMonth);
    return (
      <div key={day} className="MyTime_day">
        <button
          type="button"
          className={`MyTime_navRow ${showTasks.includes(day) ? "selected" : ""}`}
          style={showTasks.includes(day) ? { boxShadow: `0px 1px 3px rgba(${darkModeStatus ? "255, 255, 255" : "0, 0, 0"}, 0.25)` } : {}}
          onClick={() => {
            handleShowTasks(day);
          }}
        >
          <h3 className="MyTime_dayTitle">
            {day === "Today" ? (
              <>
                {(devMode ? fakeThursday : today).toLocaleString("default", { weekday: "long" })} {dayOfMonth}
                <sup>{suffix}</sup>
              </>
            ) : (
              day
            )}
          </h3>
          <button
            className="MyTime-expand-btw"
            type="button"
          >
            <div> { showTasks.includes(day) ? freeHours ? `${freeHours} hours free` : "" : <img src={chevronLeftIcon} className="chevronRight theme-icon" /> } </div>
          </button>
        </button>
        {showTasks.includes(day) ? getTimeline(day) :
          (
            <div className="MyTime_colorPalette">
              {tasks[day]?.colorBands.map((ele) => getColorComponent(ele.colorWidth, ele.color))}
            </div>
          )}
      </div>
    );
  };

  const createDummyGoals = async () => {
    starterGoals.forEach(async (goal, index) => {
      addStarterGoal(t(goal.title), goal.goalTags, index)
        .catch((error) => { console.log(error, goal); });
    });
  };

  const handleSchedulerOutput = (_schedulerOutput, activeGoals:GoalItem[]) => {
    const obj = { };
    const res = { };
    const scheduled = _schedulerOutput.scheduled.map((ele) => ({
      day: ele.day,
      outputs: ele.outputs.map((item) => ({ ...item, goalid: item.goalid.split("-filler")[0] })) }
    ));
    const impossible = _schedulerOutput.impossible.map((ele) => ({
      day: ele.day,
      outputs: ele.outputs.map((item) => ({ ...item, goalid: item.goalid.split("-filler")[0] })) }
    ));
    activeGoals.forEach((goal) => {
      obj[goal.id] = { parentGoalId: goal.parentGoalId, goalColor: goal.goalColor };
    });
    const _today = devMode ? new Date(fakeThursday) : new Date();
    scheduled.forEach((dayOutput, index) => {
      const { day } = dayOutput;
      const thisDay = { freeHrsOfDay: 0, scheduledHrs: 0, scheduled: [], impossible: [], colorBands: [] };
      impossible[index].outputs.forEach((ele) => {
        const { goalColor, parentGoalId } = obj[ele.goalid];
        thisDay.impossible.push({ ...ele, goalColor, parentGoalId });
      });
      dayOutput.outputs.forEach((ele) => {
        if (ele.title !== "free" && obj[ele.goalid]) {
          const { goalColor, parentGoalId } = obj[ele.goalid];
          thisDay.scheduledHrs += ele.duration;
          thisDay.scheduled.push({ ...ele, goalColor, parentGoalId, duration: ele.duration });
        } else {
          thisDay.freeHrsOfDay += ele.duration;
        }
      });
      const totalSlots = dayOutput.outputs.length;
      dayOutput.outputs.forEach((ele) => {
        const colorWidth = getColorWidth(ele.duration, totalSlots);
        thisDay.colorBands.push({
          colorWidth: (ele.duration / 24) * (1 / totalSlots) * 100 * 100,
          color: ele.title === "free" ? "rgba(115, 115, 115, 0.2)" : obj[ele.goalid].goalColor
        });
      });
      if (index === 0) {
        res.Today = thisDay;
      } else if (index === 1) {
        res.Tomorrow = thisDay;
      } else res[`${_today.toLocaleDateString("en-us", { weekday: "long" })}`] = thisDay;
      _today.setDate(_today.getDate() + 1);
      thisDay.freeHrsOfDay = 24 - thisDay.scheduledHrs;
    });
    return res;
  };
  useEffect(() => {
    const checkDevMode = async () => {
      const isDevMode = await checkMagicGoal();
      if (!devMode && isDevMode) {
        setDevMode(isDevMode);
      }
    };
    checkDevMode();
  }, []);
  useEffect(() => {
    const initialCall = async () => {
      let activeGoals: GoalItem[] = await getAllGoals();
      if (activeGoals.length === 0) { await createDummyGoals(); activeGoals = await getActiveGoals(); }
      console.log(activeGoals);
      getAllTasks().then((dbTasks) => {
        setTasksStatus(dbTasks.reduce((acc, curr) => ({ ...acc, [curr.goalId]: curr }), {}));
      });
      await init();
      const _today = devMode ? new Date(fakeThursday) : new Date();
      // _today.setDate(_today.getDate() + 1);
      const startDate = `${_today?.toISOString().slice(0, 10)}T00:00:00`;
      const endDate = `${new Date(_today.setDate(_today.getDate() + 7)).toISOString().slice(0, 10)}T00:00:00`;

      const schedulerInput = {
        startDate,
        endDate,
        goals: []
      };
      const noDurationGoals = [];
      activeGoals = [...activeGoals.filter((ele) => {
        if (!ele.duration && !ele.timeBudget) noDurationGoals.push(ele.id);
        return !!(ele.duration) || ele.timeBudget;
      })];
      activeGoals.forEach((ele) => {
        const obj = { id: ele.id, title: ele.title, filters: {} };
        if (ele.duration) obj.min_duration = Number(ele.duration);
        if (ele.start) {
          const start = new Date(ele.start);
          start.setDate(start.getDate() + 1);
          obj.start = `${start?.toISOString().slice(0, 10)}T${start?.toTimeString().slice(0, 8)}`;
        }
        if (ele.due) {
          const due = new Date(ele.due);
          due.setDate(due.getDate() + 1);
          obj.deadline = `${due?.toISOString().slice(0, 10)}T${due?.toTimeString().slice(0, 8)}`;
        }
        if (ele.afterTime || ele.afterTime === 0) obj.filters.after_time = ele.afterTime;
        if (ele.beforeTime || ele.beforeTime === 0) obj.filters.before_time = ele.beforeTime;
        if (ele.habit) obj.repeat = ele.habit.toLowerCase();
        if (ele.timeBudget) obj.budgets = [{ budget_type: ele.timeBudget.period === "day" ? "Daily" : "Weekly", min: Number(ele.timeBudget.duration) }];
        if (ele.sublist.length > 0) obj.children = ele.sublist.filter((id) => !noDurationGoals.includes(id));
        if (ele.on) obj.filters.on_days = ele.on.charAt(0).toUpperCase() + ele.on.slice(1);
        if (Object.keys(obj.filters).length === 0) { delete obj.filters; }
        // obj.parentGoalId = ele.parentGoalId;
        schedulerInput.goals.push(obj);
      });
      schedulerInput.goals = schedulerInput.goals.reduce((acc, curr) => ({ ...acc, [curr.id]: curr }), {});
      console.log("input", schedulerInput);
      const res = schedule(schedulerInput);
      console.log("output", res);
      const processedOutput = handleSchedulerOutput(res, activeGoals, devMode);
      // console.log(processedOutput);
      setTasks({ ...processedOutput });
    };
    initialCall();
  }, [devMode, action]);

  return (
    <AppLayout title="My Time">
      <SubHeader
        title={dailyView ? "Today" : "This Week"}
        leftNav={() => { setDailyView(!dailyView); }}
        rightNav={() => { setDailyView(!dailyView); }}
      />
      {getDayComponent("Today")}
      { !dailyView && getDayComponent("Tomorrow")}
      { !dailyView &&
        [...Array(6).keys()].map((i) => {
          const thisDay = devMode ? new Date(fakeThursday) : new Date(today);
          thisDay.setDate(thisDay.getDate() + i + 1);
          if (i >= 1) {
            return getDayComponent(`${thisDay.toLocaleDateString("en-us", { weekday: "long" })}`);
          }
        })}
    </AppLayout>
  );
};
