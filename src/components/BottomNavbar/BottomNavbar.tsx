import React from "react";

import goalsIcon from "@assets/images/goalsIcon.svg";
import calendarIcon from "@assets/images/calendarIcon.svg";
import journalIcon from "@assets/images/journalIcon.svg";

import { getOrdinalSuffix } from "@src/utils";

import "./BottomNavbar.scss";

const BottomNavbar = () => {
  const currentPage = window.location.pathname.split("/")[1];
  const [month, date] = new Date().toDateString().split(" ").slice(1, 3);

  console.log(currentPage);
  return (
    <div className="bottom-navbar">
      <div className={`bottom-nav-item ${currentPage === "MyTime" ? "active" : ""}`}>
        <img className="secondary-icon" src={calendarIcon} alt="My Time" />
        <p>{date}<sup>{getOrdinalSuffix(Number(date))}</sup>{` ${month}`}</p>
      </div>
      <div className={`bottom-nav-item ${currentPage === "MyGoals" ? "active" : ""}`}>
        <img className="secondary-icon" src={goalsIcon} alt="My Goals" />
        <p>Goals</p>
      </div>
      <div style={{ gap: 10 }} className={`bottom-nav-item ${currentPage === "MyJournal" ? "active" : ""}`}>
        <img style={{ paddingTop: 3 }} className="secondary-icon" src={journalIcon} alt="My Journal" />
        <p>Journal</p>
      </div>
    </div>
  );
};

export default BottomNavbar;
