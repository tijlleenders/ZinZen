import React from "react";

import goalsIcon from "@assets/images/goalsIcon.svg";
import calendarIcon from "@assets/images/calendarIcon.svg";
import journalIcon from "@assets/images/journalIcon.svg";

import "./BottomNavbar.scss";

const BottomNavbar = () => {
  const currentPage = window.location.pathname.split("/")[1];
  console.log(currentPage)
  return (
    <div className="bottom-navbar">
      <div className={`bottom-nav-item ${currentPage === "MyTime" ? "active" : ""}`}>
        <img src={calendarIcon} alt="My Time" />
      </div>
      <div className={`bottom-nav-item ${currentPage === "MyGoals" ? "active" : ""}`}>
        <img src={goalsIcon} alt="My Goals" />
      </div>
      <div className={`bottom-nav-item ${currentPage === "MyJournal" ? "active" : ""}`}>
        <img src={journalIcon} alt="My Journal" />
      </div>
    </div>
  );
};

export default BottomNavbar;
