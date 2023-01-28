/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Modal } from "react-bootstrap";

import plus from "@assets/images/plus.svg";

import { GoalItem } from "@src/models/GoalItem";
import { TagsExtractor } from "@src/helpers/TagsExtractor";
import ITagExtractor from "@src/Interfaces/ITagExtractor";
import { ISharedGoal } from "@src/Interfaces/ISharedGoal";
import { addGoal, getGoal, updateGoal } from "@src/api/GoalsAPI";
import { displaySuggestionsModal, extractedTitle, inputGoalTags } from "@src/store/GoalsState";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { darkModeState, displayToast } from "@src/store";
import InputGoal from "../InputGoal";

import "./SuggestionModal.scss";

interface SuggestionModalProps {
  goalID: string,
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({ goalID }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);

  const [open, setOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<{index: number, goal:ISharedGoal|GoalItem} | null>(null);
  const [goalLang, setGoalLang] = useState("en");
  const [goalInput, setGoalInput] = useState("");
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [showSuggestionsModal, setShowSuggestionsModal] = useRecoilState(displaySuggestionsModal);

  const addSuggestedGoal = async (goal:ISharedGoal | GoalItem, index:number) => {
    let newGoalId;
    if (!selectedGoal) {
      const { id: prevId, ...newGoal } = { ...goal, parentGoalId: goalID, sublist: [], archived: "false" };
      newGoalId = await addGoal(createGoalObjectFromTags(newGoal));
    } else if (selectedGoal.index !== index) {
      setSelectedGoal(null);
      return;
    } else {
      const newGoal = createGoalObjectFromTags({
        language: goalLang,
        parentGoalId: goalID,
        title: goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
        repeat: goalTags.repeats ? goalTags?.repeats.value.trim() : null,
        duration: goalTags.duration ? goalTags.duration.value : null,
        start: goalTags.start ? goalTags.start.value : null,
        due: goalTags.due ? goalTags.due.value : null,
        afterTime: goalTags.afterTime ? goalTags.afterTime.value : null,
        beforeTime: goalTags.beforeTime ? goalTags.beforeTime.value : null,
        link: goalTags.link ? `${goalTags.link.value}`.trim() : null,
        goalColor: selectedGoal?.goal.goalColor
      });
      newGoalId = await addGoal(newGoal);
    }
    if (goalID !== "root" && newGoalId) {
      const parentGoal = await getGoal(goalID);
      const newSublist = parentGoal ? [...parentGoal.sublist, newGoalId] : [newGoalId];
      await updateGoal(goalID, { sublist: newSublist });
    }
    setSelectedGoal(null);
    setShowToast({ open: true, message: newGoalId ? "Goal Added!" : "Failed to add this Goal", extra: "" });
  };

  const getSuggestions = () => {
    const { goals } = showSuggestionsModal;
    return goals.map((goal, index) => (
      <div key={goal.id}>
        <div
          onClick={() => setSelectedGoal(selectedGoal?.index === index ? null : { index, goal })}
          className="suggestions-goal-name"
          style={{ backgroundColor: goal.goalColor }}
        >
          <p style={{ marginBottom: 0 }}>{goal.title}</p>
          <button
            type="button"
            onClickCapture={(e) => {
              e.stopPropagation();
              addSuggestedGoal(goal, index);
            }}
          >
            <img alt="goal suggestion" src={plus} style={{ filter: "brightness(1) invert(0)" }} />
          </button>
        </div>
        { goalInput !== "" && selectedGoal?.index === index && (
        <InputGoal
          goalInput={goalInput}
          selectedColor={goal.goalColor ? goal.goalColor : "#FFFFFF"}
          goalLang={goalLang}
          goalTags={goalTags}
          setGoalTags={setGoalTags}
          setGoalTitle={setGoalTitle}
        />
        )}
      </div>
    ));
  };

  useEffect(() => {
    if (selectedGoal) {
      const { goal } = selectedGoal;
      let tmpTiming = "";
      if (goal.afterTime && goal.beforeTime) {
        tmpTiming = ` ${goal.afterTime}-${goal.beforeTime}`;
      } else if (goal.afterTime) {
        tmpTiming = ` after ${goal.afterTime}`;
      } else if (goal.beforeTime) {
        tmpTiming = ` before ${goal.beforeTime}`;
      }
      const tmp = `${goal.title}${goal.duration ? ` ${goal.duration}h` : ""}${goal.start ? ` start ${goal.start.getDate()}/${goal.start.getMonth() + 1}` : ""}${goal.due ? ` due ${goal.due.getDate()}/${goal.due.getMonth() + 1}` : ""}${goal.repeat ? ` ${goal.repeat}` : ""}${tmpTiming}${goal.link ? ` ${goal.link}` : ""}`;
      setGoalInput(tmp);
      const output: ITagExtractor = TagsExtractor(tmp);
      if (output.occurences.length > 0) setGoalTitle(goalInput.slice(0, output.occurences[0].index));
      else setGoalTitle(goalInput.trim());
      setGoalTags(output.tags);
      // setMagicIndices(output.occurences);
      if (goal.language) setGoalLang(goal.language);
    } else {
      setGoalInput("");
      setGoalTitle("");
      setGoalTags({});
    }
  }, [selectedGoal]);

  useEffect(() => {
    if (["Archive", "Public"].includes(showSuggestionsModal.selected)) {
      setOpen(true);
    }
  }, [showSuggestionsModal]);

  return (
    <Modal
      id={`suggestions-modal${darkModeStatus ? "-dark" : ""}`}
      show={open}
      onHide={() => { setOpen(false); setShowSuggestionsModal({ goals: [], selected: "" }); }}
      centered
      autoFocus={false}
    >
      <Modal.Body id="suggestions-modal-body">
        <p id="archive-title">
          { `Add from ${showSuggestionsModal.selected || ""}` }
        </p>
        <div style={{ height: "35vh", overflowY: "scroll" }}>
          {getSuggestions()}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SuggestionModal;
