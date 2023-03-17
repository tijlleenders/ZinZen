import React, { useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useRecoilValue, useSetRecoilState } from "recoil";

import settings from "@assets/images/settings.svg";
import correctLight from "@assets/images/correctLight.svg";
import correctDark from "@assets/images/correctDark.svg";

import { darkModeState } from "@src/store";
import { convertNumberToHr } from "@src/utils";
import { GoalItem } from "@src/models/GoalItem";
import { displayUpdateGoal } from "@src/store/GoalsState";
import { getHeadingOfTag, goalConfigTags } from "@src/constants/myGoals";

import "./GoalConfigModal.scss";

const EditTagSection = ({ title } : { title: string }) => {
  let options: number[] | string[] = [];
  if (title === "Duration") {
    options = ["-", ...[...Array(24).keys()].map((ele) => `${ele + 1}`)];
  } else if (title === "Habit") {
    options = [...["-", "Daily", "Weekly"]];
  }
  const [due, setDue] = useState("");
  const [start, setStart] = useState("");
  const [budget, setBudget] = useState({ hrs: "", period: "day" });
  const [otherTagValues, setOtherTagValues] = useState({ Duration: "-", Habit: "-" });
  const [selectedFilter, setSelectedFilter] = useState({ active: "On", On: "-", Before: "-", After: "-" });

  return (
    <div>
      {title === "Due date" && <input type="date" className="datepicker" value={start} onChange={(e) => setStart(e.target.value)} name={title} />}
      {title === "Start date" && <input type="date" className="datepicker" value={due} onChange={(e) => setDue(e.target.value)} name={title} />}
      { (title === "Duration" || title === "Habit") && (
        <ul className="dropdown">
          {options.map((ele) => (
            <li className={otherTagValues[title] === `${ele}` ? "selected" : ""} key={ele}>
              <button type="button" onClick={() => { setOtherTagValues({ ...otherTagValues, [title]: `${ele}` }); }}>{ele}</button>
            </li>
          ))}
        </ul>
      )}
      {title === "Filter" && (
      <div className="filter">
        <select className="dropdown" onChange={(e) => setSelectedFilter({ ...selectedFilter, active: e.target.value })}>
          {
            ["On", "Before", "After"].map((ele) => <option key={ele} value={ele}>{ele}</option>)
          }
        </select>
        <ul className="dropdown">
          {(selectedFilter.active === "On" ? ["-", "Weekends", "Weekdays"] : ["-", ...Array(25).keys()]).map((ele) => (
            <li className={selectedFilter[selectedFilter.active] === `${ele}` ? "selected" : ""} key={ele}>
              <button type="button" onClick={() => { setSelectedFilter({ ...selectedFilter, [selectedFilter.active]: `${ele}` }); }}>
                {selectedFilter.active === "On" ? ele : ele === "-" ? "-" : convertNumberToHr(ele)}
              </button>
            </li>
          ))}
        </ul>
      </div>
      )}
      {title === "Time budget" && (
        <div className="budget">
          <Form.Control
            aria-label="Small"
            aria-describedby="inputGroup-sizing-sm"
            value={budget.hrs}
            placeholder="0"
            onChange={(e) => {
              const { value } = e.target;
              setBudget({ ...budget, hrs: value });
            }}
          />
          <p>hrs per</p>
          <select defaultValue={budget.period} className="dropdown" onChange={(e) => setBudget({ ...budget, period: e.target.value })}>
            {
              ["day", "week"].map((ele) => <option key={`budget-${ele}`} value={ele}>{ele}</option>)
            }
          </select>
        </div>
      )}
    </div>
  );
};
const GoalConfigModal = ({ goal }: { goal : GoalItem }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowUpdateGoal = useSetRecoilState(displayUpdateGoal);

  const [selectedTag, setSelectedTag] = useState("Duration");

  const getTagLabel = (name: string) => (
    <button
      type="button"
      onClick={() => { setSelectedTag(name); }}
      className={`tagOption${darkModeStatus ? "-dark" : ""} ${selectedTag === name ? "selected" : ""}`}
    >
      {name}
    </button>
  );
  return (
    <Modal
      id="editTagModal"
      className="popupModal"
      onHide={() => { setShowUpdateGoal(null); }}
      show={!!goal}
    >
      <Modal.Header>
        <div>
          <img src={settings} alt="edit goal" /> {goal.title}
        </div>
        <button type="button">
          <img src={darkModeStatus ? correctDark : correctLight} alt="save changes" />
        </button>
      </Modal.Header>
      <Modal.Body>
        <div id="tagsList">
          {goalConfigTags.map((tagName) => (
            getTagLabel(tagName)
          ))}
        </div>
        <div id="editSection">
          <p className="tag-heading">{getHeadingOfTag(selectedTag)}</p>
          <EditTagSection title={selectedTag} />
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default GoalConfigModal;
