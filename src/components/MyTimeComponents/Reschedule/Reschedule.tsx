import { Tooltip } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { darkModeState } from "@src/store";
import { getMonthByIndex } from "@src/utils";
import SubHeader from "@src/common/SubHeader";
import { convertDateToDay } from "@src/utils/SchedulerUtils";

import "./Reschedule.scss";
import { displayReschedule } from "@src/store/TaskState";
import { ITask } from "@src/Interfaces/Task";
import { getFromOutbox } from "@src/api/DumpboxAPI";
import { IFinalOutputSlot } from "@src/Interfaces/IScheduler";
import ZModal from "@src/common/ZModal";
import ScheduledSlots from "./ScheduledSlots";

const Reschedule = () => {
  const [task, setOpen] = useRecoilState(displayReschedule);
  if (!task) {
    return null;
  }
  let today = new Date();
  if (today.getHours() + task.duration > 23) {
    today = new Date(today.setDate(today.getDate() + 1));
  }
  const currHr = today.getHours();
  const currDate = today.getDate();
  const currMonth = today.getMonth();
  const lastDate = new Date(2023, today.getMonth() + 1, 0).getDate();

  const [selectedHr, setSelectedHr] = useState(currHr === new Date().getHours() ? 8 : currHr);
  const [monthIndex, setMonthIndex] = useState(currMonth);
  const [selectedDay, setSelectedDay] = useState(currDate);
  const [selectedDate, setSelctedDate] = useState(today);
  const [endDate, setEndDate] = useState<Date>(today);
  const [overridenTasks, setOverridenTasks] = useState<IFinalOutputSlot[]>([]);
  const [schedulerOutput, setSchedulerOutput] = useState<{ [key: string]: IFinalOutputSlot[] }>({});

  const darkModeStatus = useRecoilValue(darkModeState);

  const getSlots = (start: number, end: number) =>
    [...Array(end).keys()].slice(start).map((hr) => (
      <button
        type="button"
        key={uuidv4()}
        onClick={() => setSelectedHr(hr)}
        className={`slot-card ${hr > selectedHr && hr < task.duration + selectedHr ? "booked" : ""} ${
          hr === selectedHr ? "selected" : ""
        }`}
      >
        <p style={hr === selectedHr ? { color: !darkModeStatus ? "#CD6E51" : "#9E9E9E" } : {}}>
          {hr}
          <sup>00</sup>
        </p>
      </button>
    ));

  useEffect(() => {
    getFromOutbox("scheduler").then((res) => {
      if (res) {
        const { scheduled } = JSON.parse(JSON.parse(res.value).output);
        setEndDate(new Date(scheduled.slice(-1)[0].day));
        const temp: { [key: string]: IFinalOutputSlot[] } = {};
        scheduled.forEach((sod: { day: string; tasks: IFinalOutputSlot[] }) => {
          temp[new Date(sod.day).toLocaleDateString()] = sod.tasks;
        });
        setSchedulerOutput({ ...temp });
      }
    });
  }, []);

  // useEffect(() => {
  //   if (task) document.getElementsByClassName("slot-card")[currHr].scrollIntoView({ inline: "center" });
  // }, [task]);

  useEffect(() => {
    const tmp = new Date(today.getFullYear(), monthIndex, selectedDay);
    if (tmp > endDate) {
      setOverridenTasks([]);
    }
    if (tmp > today) {
      console.log("sdd");
      setSelectedHr(8);
    }
    setSelctedDate(tmp);
  }, [selectedDay, monthIndex]);

  // console.log(schedulerOutput, selectedDate.toLocaleDateString(), schedulerOutput[selectedDate.toLocaleDateString()]);
  return task ? (
    <ZModal type="rescheduleModal" open={!!task} onCancel={() => setOpen(null)}>
      <div className="header-title">
        <h4>{task.title}</h4>
      </div>
      <SubHeader
        showLeftNav={monthIndex > today.getMonth()}
        showRightNav={monthIndex < 11}
        title={getMonthByIndex(monthIndex)}
        leftNav={() => setMonthIndex(monthIndex - 1)}
        rightNav={() => setMonthIndex(monthIndex + 1)}
      />
      <hr style={{ marginBottom: "0.5rem" }} />
      <div className="list">
        {[...Array(lastDate + 1).keys()].slice(currDate).map((onDate) => (
          <button
            type="button"
            onClick={() => {
              setSelectedDay(onDate);
            }}
            key={uuidv4()}
            className={`res-card ${onDate === selectedDay ? "selected" : ""}`}
          >
            <p style={{ color: "black" }}>{convertDateToDay(new Date(new Date().setDate(onDate))).slice(0, 3)}</p>
            <p style={onDate === selectedDay ? { color: !darkModeStatus ? "#CD6E51" : "#9E9E9E" } : {}}>{onDate}</p>
          </button>
        ))}
      </div>
      <hr style={{ margin: "0.5rem 0" }} />
      <p className="subheader-title" style={{ margin: "1rem 0 0 0" }}>
        Pick {task.duration} hour{task.duration > 1 ? "s" : ""}
      </p>
      <div className="list">
        {schedulerOutput[selectedDate.toLocaleDateString()] ? (
          <ScheduledSlots
            selectedDate={selectedDate}
            selectedHr={selectedHr}
            setSelectedHr={setSelectedHr}
            targetDuration={task.duration}
            tasks={schedulerOutput[selectedDate.toLocaleDateString()]}
            setOverridenTasks={setOverridenTasks}
          />
        ) : (
          getSlots(0, 25)
        )}
      </div>
      <div className="list">
        {overridenTasks.map((psTask: ITask) => (
          <button
            type="button"
            key={uuidv4()}
            style={{ textDecoration: "line-through" }}
            className="slot-card task-card" // ${hr === selectedHr ? "selected" : ""}`}
          >
            <Tooltip placement="top" title={psTask.title}>
              {psTask.title.slice(0, 10)}
            </Tooltip>
          </button>
        ))}
      </div>
      <div>
        <button
          type="button"
          className="action-btn"
          onClick={async () => {
            // const on = new Date(today.getFullYear(), monthIndex, selectedDay, selectedHr, 0, 0);
            // const end = selectedHr + task.duration;
            // await rescheduleTaskOnDay(on, task.goalid, selectedHr, end >= 24 ? 0 : end);
          }}
        >
          Reschedule
        </button>
      </div>
    </ZModal>
  ) : null;
};

export default Reschedule;
