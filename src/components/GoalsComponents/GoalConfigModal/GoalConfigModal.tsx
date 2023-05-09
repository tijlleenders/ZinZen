import { Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import pencil from "@assets/images/pencil.svg";
import correct from "@assets/images/correct.svg";
import correctLight from "@assets/images/correctLight.svg";
import correctDark from "@assets/images/correctDark.svg";
import publicGoals from "@assets/images/publicGoals.svg";

import Loader from "@src/common/Loader";
import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import ColorPalette from "@src/common/ColorPalette";
import { darkModeState, displayInbox, displayToast } from "@src/store";
import { getPublicGoals } from "@src/services/goal.service";
import { createGoal, modifyGoal } from "@src/helpers/GoalController";
import { getHeadingOfTag, goalConfigTags } from "@src/constants/myGoals";
import { colorPalleteList, convertNumberToHr, getDateInText } from "@src/utils";
import { addInGoalsHistory, displayAddGoal, displayGoalId, displaySuggestionsModal, displayUpdateGoal, goalsHistory, selectedColorIndex } from "@src/store/GoalsState";

import "./GoalConfigModal.scss";
import { themeState } from "@src/store/ThemeState";

export interface EditTagSectionProps {
  title: string,
  handleChange: (newChange: object) => void,
  changes: GoalItem
}
const EditTagSection: React.FC<EditTagSectionProps> = ({ title, changes, handleChange }) => {
  let options: number[] | string[] = [];
  if (title === "Duration") {
    options = ["-", ...[...Array(24).keys()].map((ele) => `${ele + 1}`)];
  } else if (title === "Habit") {
    options = [...["-", "daily", "weekly"]];
  }
  const [due, setDue] = useState(changes.due ? new Date(changes.due).toISOString().slice(0, 10) : "");
  const [start, setStart] = useState(changes.start ? new Date(changes.start).toISOString().slice(0, 10) : "");
  const [budget, setBudget] = useState({ duration: changes.timeBudget?.duration || "", period: changes.timeBudget?.duration || "day" });
  const [otherTagValues, setOtherTagValues] = useState({ duration: `${changes.duration || "-"}`, habit: changes.habit || "-" });
  const [selectedFilter, setSelectedFilter] = useState({ active: "On", On: changes.on || "-", Before: `${changes.beforeTime || "-"}`, After: `${changes.afterTime || "-"}` });
  const [budgetPeriod, setBudgetPeriod] = useState("day");
  const budgetEditable = !(changes.duration);
  const durationEditable = title === "Duration" && !changes.timeBudget;
  const darkModeStatus = useRecoilValue(darkModeState);

  const handleOtherTags = (value: string) => {
    if (durationEditable || title === "Habit") {
      setOtherTagValues({ ...otherTagValues, [title]: value });
      handleChange({ [title.toLowerCase()]: value === "-" ? null : value.toLowerCase() });
    }
  };
  const handleDates = (value: string) => {
    handleChange({ [title === "Start date" ? "start" : "due"]: new Date(value).toString() });
    if (title === "Start date") {
      setStart(value);
    } else { setDue(value); }
  };
  const handleFilterChange = (filterName: string, value: string) => {
    console.log(selectedFilter);
    setSelectedFilter({ ...selectedFilter, [filterName]: value });
    handleChange({ [`${filterName.toLowerCase()}${filterName === "On" ? "" : "Time"}`]: filterName === "On" ? value !== "-" ? value : null : Number(value) });
  };

  const handleBudgetChange = (newBudget:{
    duration: string;
    period: string;
  }) => {
    setBudget({ ...newBudget });
    setBudgetPeriod(newBudget.period);
    handleChange({ timeBudget: newBudget });
  };

  useEffect(() => {
    setDue(changes.due ? new Date(changes.due).toISOString().slice(0, 10) : "");
    setStart(changes.start ? new Date(changes.start).toISOString().slice(0, 10) : "");
    setBudget({ duration: changes.timeBudget?.duration || "", period: changes.timeBudget?.duration || "day" });
    setOtherTagValues({ duration: `${changes.duration || "-"}`, habit: changes.habit || "-" });
    setSelectedFilter({ active: selectedFilter.active, On: changes.on || "-", Before: `${changes.beforeTime || "-"}`, After: `${changes.afterTime || "-"}` });
  }, [changes]);
  return (
    <>
      <p className="tag-heading">
        {title === "Duration" && getHeadingOfTag(title, !durationEditable)}
        {title === "Time budget" && getHeadingOfTag(title, !budgetEditable)}
        {(title !== "Duration" && title !== "Time budget") && getHeadingOfTag(title)}
      </p>
      <div>
        {title === "Due date" && <input type="date" className="datepicker" value={due} onChange={(e) => handleDates(e.target.value)} name={title} />}
        {title === "Start date" && <input type="date" className="datepicker" value={start} onChange={(e) => handleDates(e.target.value)} name={title} />}
        { (title === "Duration" || title === "Habit") && (
          <ul className={`dropdown ${title === "Duration" ? durationEditable ? "" : "restricted" : ""}`}>
            {options.map((ele) => (
              <li className={otherTagValues[title.toLowerCase()] === `${ele}` ? `selected${darkModeStatus ? "-dark" : ""}` : ""} key={ele}>
                <button type="button" onClick={() => { handleOtherTags(`${ele}`); }}>{ele}</button>
              </li>
            ))}
          </ul>
        )}
        {title === "Filter" && (
        <div className="filter">
          <select defaultValue={selectedFilter.active} className="dropdown" onChange={(e) => setSelectedFilter({ ...selectedFilter, active: e.target.value })}>
            {
              ["On", "Before", "After"].map((ele) => <option key={ele} value={ele}>{ele}</option>)
            }
          </select>
          <ul className="dropdown">
            {(selectedFilter.active === "On" ? ["-", "weekends", "weekdays"] : ["-", ...Array(25).keys()]).map((ele) => (
              <li className={selectedFilter[selectedFilter.active] === `${ele}` ? `selected${darkModeStatus ? "-dark" : ""}` : ""} key={ele}>
                <button type="button" onClick={() => { handleFilterChange(selectedFilter.active, `${ele}`); }}>
                  {selectedFilter.active === "On" ? ele : ele === "-" ? "-" : convertNumberToHr(ele)}
                </button>
              </li>
            ))}
          </ul>
        </div>
        )}
        {title === "Time budget" && (
          <div className={`budget ${budgetEditable ? "" : "restricted"}`}>
            <Form.Control
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              value={budget.duration}
              placeholder="0"
              onChange={(e) => {
                const { value } = e.target;
                handleBudgetChange({ duration: value, period: Number(value) > 24 ? "week" : budgetPeriod });
              }}
            />
            <p>hrs per</p>
            <select value={budgetPeriod} className="dropdown" onChange={(e) => handleBudgetChange({ ...budget, period: e.target.value })}>
              {
                ["day", "week"].map((ele) => <option key={`budget-${ele}`} value={ele}>{ele}</option>)
              }
            </select>
          </div>
        )}
      </div>
    </>
  );
};
const GoalConfigModal = ({ goal }: { goal : GoalItem }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const theme = useRecoilValue(themeState);
  const openInbox = useRecoilValue(displayInbox);
  const darkModeStatus = useRecoilValue(darkModeState);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalsHistory = useRecoilValue(goalsHistory);

  const setShowToast = useSetRecoilState(displayToast);
  const addInHistory = useSetRecoilState(addInGoalsHistory);

  const [empty, setEmpty] = useState({ P: true });
  const [newTitle, setNewTitle] = useState(goal.title);
  const [selectedTag, setSelectedTag] = useState("Duration");
  const [changes, setChanges] = useState<GoalItem>({ ...goal });

  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);
  const setShowSuggestionsModal = useSetRecoilState(displaySuggestionsModal);
  const [showUpdateGoal, setShowUpdateGoal] = useRecoilState(displayUpdateGoal);

  const handleChange = (newChange: object) => {
    setChanges({ ...changes, ...newChange });
  };

  const getTagLabel = (name: string) => (
    <button
      type="button"
      onClick={() => { setSelectedTag(name); }}
      className={`tagOption${darkModeStatus ? "-dark" : ""} ${selectedTag === name ? `selected${darkModeStatus ? "-dark" : ""}` : ""}`}
    >
      {name}
    </button>
  );
  const getTag = (tagName: string, content: string | null) => (
    <button
      type="button"
      style={{ backgroundColor: colorPalleteList[colorIndex] }}
      className="form-tag"
      onClick={() => { if (!openInbox) { setChanges({ ...changes, [tagName]: null }); } }}
    >
      {content}
    </button>
  );

  const isTitleEmpty = () => {
    if (newTitle.length === 0) { setShowToast({ open: true, message: `Goal cannot be ${showAddGoal ? "added" : "updated"} without title`, extra: "" }); }
    return newTitle.length === 0;
  };
  const addThisGoal = async () => {
    if (!showAddGoal || isTitleEmpty()) { return; }
    // const { valid, reason } = areGoalTagsValid(goalTags);
    // if (!valid) { setShowToast({ open: true, message: reason, extra: "" }); return; }
    const { parentGoal } = await createGoal(showAddGoal.goalId, changes, newTitle, colorPalleteList[colorIndex], subGoalsHistory.length);
    // @ts-ignore
    if (parentGoal && selectedGoalId !== parentGoal.id) { addInHistory(parentGoal); }
    if (!parentGoal && newTitle === "magic") { setShowToast({ open: true, message: "Congratulations, you activated DEV mode", extra: "Explore what's hidden" }); }
  };
  const updateThisGoal = async () => {
    if (!showUpdateGoal || isTitleEmpty()) { return; }
    await modifyGoal(showUpdateGoal.goalId, changes, newTitle, colorPalleteList[colorIndex], subGoalsHistory.length);
  };
  const handleSave = async () => {
    if (showAddGoal) {
      await addThisGoal();
      setShowAddGoal(null);
    } else if (showUpdateGoal) {
      await updateThisGoal();
      setShowUpdateGoal(null);
    }
  };

  const handleClose = () => {
    setShowAddGoal(null);
    setShowUpdateGoal(null);
  };

  useEffect(() => {
    if (showAddGoal?.open) { document.getElementById("inputGoalField")?.focus(); }
  }, []);
  return (
    <Modal
      id="editTagModal"
      className={`${openInbox ? "inboxCall" : ""} popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
      onHide={handleSave}
      show={!!showAddGoal || !!showUpdateGoal}
    >
      <Modal.Header>
        <div style={{ display: "flex", gap: "10px", paddingTop: "10px" }}>
          <button
            onClick={() => handleSave()}
            type="button"
            style={{
              position: "absolute",
              borderRadius: "50%",
              border: "none",
              background: "var(--primary-background)",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.25)",
              width: 50,
              height: 50,
              right: 10,
              top: -60
            }}
          >
            <img
              alt="Save Goal"
              src={correct}
              style={{ cursor: "Pointer" }}
              className={`${darkModeStatus ? "dark-svg" : ""}`}
            />
          </button>
          <div
            style={{ display: "flex",
              width: "100%",
              justifyContent: "center",
              position: "absolute",
              top: 0,
              right: 0 }}
          >
            <div aria-hidden role="button" style={{ padding: "0px 20px" }} onTouchMove={() => handleClose()}>
              <hr style={{ width: 80, border: "solid 1px" }} />
            </div>
          </div>
          <img
            style={{ alignSelf: "flex-start", marginTop: "5px" }}
            src={pencil}
            width={25}
            alt="edit goal"
            className={`${darkModeStatus ? "dark-svg" : ""}`}
            onClickCapture={() => { if (!openInbox) document.getElementById("inputGoalField")?.focus(); }}
          />
          <div>
            <input
              disabled={openInbox}
              value={newTitle}
              id="inputGoalField"
              style={{ color: darkModeStatus ? "white" : "black" }}
              placeholder={t("addGoalPlaceholder")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  document.getElementById("inputGoalField")?.blur();
                }
              }}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div id="tagsContainer">
              { changes.start &&
              getTag("start", `Start ${getDateInText(new Date(changes.start))} ${changes.afterTime ? "" : `, ${new Date(changes.start).toTimeString().slice(0, 5)}`}`)}

              { (changes.afterTime || changes.afterTime === 0) &&
              getTag("afterTime", `After ${changes.afterTime}:00`)}

              { changes.due &&
              getTag("due", `Due ${getDateInText(new Date(changes.due))}${changes.beforeTime ? "" : `, ${new Date(changes.due).toTimeString().slice(0, 5)}`}`)}

              { (changes.beforeTime || changes.beforeTime === 0) &&
              getTag("beforeTime", `Before ${changes.beforeTime}:00`)}

              { changes.duration &&
              getTag("duration", `${changes.duration}h`)}

              { changes.habit &&
              getTag("habit", changes.habit)}

              { changes.on &&
              getTag("on", `On ${changes.on}`)}

              { changes.timeBudget &&
              getTag("timeBudget", `${changes.timeBudget.duration}hr${Number(changes.timeBudget.duration) > 1 ? "s" : ""} / ${changes.timeBudget.period}`)}
            </div>
            { !openInbox && <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} /> }
          </div>
        </div>
        <div id="config-actions">
          <button id="saveGoal" type="button" onClick={handleSave}>
            <img width={40} src={darkModeStatus ? correctDark : correctLight} alt="save changes" />
          </button>
          { showAddGoal && (
            <button
              type="button"
              style={{ borderRadius: "50%" }}
              className={` hintsBtn ${showAddGoal ? `${darkModeStatus ? "dark" : "light"}-svg-bg` : ""}`}
              onClick={async () => {
                if (showAddGoal) {
                  setLoading(true);
                  const res = await getPublicGoals(selectedGoalId === "root" ? "root" : (await getGoal(selectedGoalId)).title);
                  if (res.status && res.data?.length > 0) {
                    const tmpPG = [...res.data];
                    setEmpty({ ...empty, P: tmpPG.length === 0 });
                    setShowSuggestionsModal({ selected: "Public", goals: [...tmpPG] });
                  } else {
                    setShowToast({ open: true, message: "Awww... no hints today. We'll keep looking!", extra: "" });
                  }
                  setLoading(false);
                }
              }}
            >
              <img
                alt="search goal"
                className={showAddGoal && darkModeStatus ? "dark-svg" : ""}
                style={!showAddGoal && darkModeStatus ? { filter: "invert(1)" } : {}}
                src={publicGoals}
                width={40}
              />
              { loading && <Loader /> }
            </button>
          )}
        </div>
      </Modal.Header>
      { !openInbox && (
      <Modal.Body>
        <div id="tagsList">
          {goalConfigTags.map((tagName) => (
            getTagLabel(tagName)
          ))}
        </div>
        <div className={`editSection${darkModeStatus ? "-dark" : ""}`}>
          <EditTagSection changes={changes} title={selectedTag} handleChange={handleChange} />
        </div>
      </Modal.Body>
      )}
    </Modal>
  );
};

export default GoalConfigModal;
