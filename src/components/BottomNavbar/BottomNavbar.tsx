import React from "react";
import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router";

import goalsIcon from "@assets/images/goalsIcon.svg";
import calendarIcon from "@assets/images/calendarIcon.svg";
import journalIcon from "@assets/images/journalIcon.svg";
import { darkModeState, displayInbox } from "@src/store";

import { getOrdinalSuffix } from "@src/utils";
import GlobalAddBtn from "@components/GlobalAddBtn";

import "./BottomNavbar.scss";

const BottomNavbar = ({ title }: { title: string}) => {
  const navigate = useNavigate();
  const openInbox = useRecoilValue(displayInbox);
  const darkModeStatus = useRecoilValue(darkModeState);
  const currentPage = window.location.pathname.split("/")[1];
  const [month, date] = new Date().toDateString().split(" ").slice(1, 3);

  const handleClick = (to: string) => {
    if (to === "MyTime") {
      if (currentPage !== "") navigate("/");
    } else if (to === "MyGoals") {
      if (currentPage !== "MyGoals") navigate("/MyGoals");
    } else if (currentPage !== "MyJournal") {
      navigate("/MyJournal");
    }
  };

  return (
    <div className={`bottom-navbar${darkModeStatus ? "-dark" : ""}`}>
      <button type="button" onClick={() => { handleClick("MyTime"); }} className={`bottom-nav-item ${currentPage === "" ? "active" : ""}`}>
        <img className="secondary-icon" style={{ width: 24 }} src={calendarIcon} alt="My Time" />
        <p>{date}<sup>{getOrdinalSuffix(Number(date))}</sup>{` ${month}`}</p>
      </button>
      <button type="button" onClick={() => { handleClick("MyGoals"); }} className={`bottom-nav-item ${currentPage === "MyGoals" && openInbox ? "active" : ""}`}>
        <img className="secondary-icon" src={goalsIcon} alt="My Goals" />
        <p>Goals</p>
      </button>
      <button type="button" onClick={() => { handleClick("MyJournal"); }} style={{ gap: 10 }} className={`bottom-nav-item ${currentPage === "MyJournal" ? "active" : ""}`}>
        <img style={{ paddingTop: 3 }} className="secondary-icon" src={journalIcon} alt="My Journal" />
        <p>Journal</p>
        { title !== "My Time" && <GlobalAddBtn add={title} /> }
      </button>
    </div>
  );
};

export default BottomNavbar;
