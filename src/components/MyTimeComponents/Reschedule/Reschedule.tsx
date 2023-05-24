import { Modal } from "antd";
import { useRecoilState, useRecoilValue } from "recoil";
import React, { useEffect, useState } from "react";

import { darkModeState } from "@src/store";
import { getMonthByIndex } from "@src/utils";
import SubHeader from "@src/common/SubHeader";
import { themeState } from "@src/store/ThemeState";
import { convertDateToDay } from "@src/utils/SchedulerUtils";

import "./Reschedule.scss";
import { displayReschedule } from "@src/store/TaskState";

const Reschedule = () => {
  const currHr = new Date().getHours();
  const currDate = new Date().getDate();
  const currMonth = new Date().getMonth();
  const lastDate = new Date(2023, currMonth + 1, 0).getDate();

  const [open, setOpen] = useRecoilState(displayReschedule);
  const [selectedHr, setSelectedHr] = useState(currHr);
  const [monthIndex, setMonthIndex] = useState(currMonth);
  const [selectedDay, setSelectedDay] = useState(currDate);

  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);

  const getSlots = (start: number, end: number) => [...Array(end).keys()].slice(start).map((hr) => (
    <button
      type="button"
      key={currDate}
      onClick={() => setSelectedHr(hr)}
      className={`slot-card ${hr === selectedHr ? "selected" : ""}`}
    >
      <p style={hr === selectedHr ? { color: !darkModeStatus ? "#CD6E51" : "#9E9E9E" } : {}}>
        {hr}<sup>00</sup>
      </p>
    </button>
  ));

  useEffect(() => {
    if (open) document.getElementsByClassName("slot-card")[currHr].scrollIntoView({ inline: "center" });
  }, [open]);
  return (
    <Modal
      open={open}
      closable={false}
      footer={null}
      onCancel={() => setOpen(false)}
      className={`rescheduleModal popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
    >
      <div className="header-title"><h4>Walking</h4></div>
      <SubHeader
        showLeftNav={monthIndex > 0}
        showRightNav={monthIndex < 11}
        title={getMonthByIndex(monthIndex)}
        leftNav={() => setMonthIndex(monthIndex - 1)}
        rightNav={() => setMonthIndex(monthIndex + 1)}
      />
      <hr style={{ marginBottom: "0.5rem" }} />
      <div className="list">
        {[...Array(lastDate + 1).keys()].slice(currDate).map((onDate) => (
          <button type="button" onClick={() => setSelectedDay(onDate)} key={currDate} className={`res-card ${onDate === selectedDay ? "selected" : ""}`}>
            <p style={{ color: "black" }}>{convertDateToDay(new Date(new Date().setDate(onDate))).slice(0, 3)}</p>
            <p style={onDate === selectedDay ? { color: !darkModeStatus ? "#CD6E51" : "#9E9E9E" } : {}}>{onDate}</p>
          </button>
        ))}
      </div>
      <hr style={{ margin: "0.5rem 0" }} />
      <p className="subheader-title" style={{ margin: "1rem 0 0 0" }}>Pick a slot</p>
      <div className="list">
        {getSlots(0, 25)}
      </div>
      <div>
        <button type="button" className="action-btn"> Reschedule </button>
      </div>
    </Modal>
  );
};

export default Reschedule;
