/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Modal } from "react-bootstrap";

import plus from "@assets/images/plus.svg";

import { addGoal, createGoal, getGoal, getGoalsFromArchive, getPublicGoals, updateGoal } from "@src/api/GoalsAPI";
import { TagsExtractor } from "@src/helpers/TagsExtractor";
import { ISharedGoal } from "@src/Interfaces/ISharedGoal";
import { displaySuggestionsModal, extractedTitle, inputGoalTags } from "@src/store/GoalsState";
import ITagExtractor from "@src/Interfaces/ITagExtractor";
import { GoalItem } from "@src/models/GoalItem";
import InputGoal from "./InputGoal";

interface SuggestionModalProps {
  goalID: number,
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({ goalID }) => {
  const [selectedGoal, setSelectedGoal] = useState<{index: number, goal:ISharedGoal} | null>(null);
  const [goalLang, setGoalLang] = useState("en");
  const [archiveGoals, setArchiveGoals] = useState<GoalItem[]>([]);
  const [publicGoals, setPublicGoals] = useState<ISharedGoal[]>([]);

  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [goalInput, setGoalInput] = useState("");
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [showSuggestionsModal, setShowSuggestionsModal] = useRecoilState(displaySuggestionsModal);

  const addSuggestedGoal = async (goal:ISharedGoal, index:number) => {
    let newGoalId;
    if (!selectedGoal) {
      const { id: prevId, ...newGoal } = { ...goal, parentGoalId: goalID, sublist: null, status: 0 };
      newGoalId = await addGoal(newGoal);
    } else if (selectedGoal.index !== index) {
      setSelectedGoal(null);
      return;
    } else {
      const newGoal = createGoal(
        goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
        goalTags.repeats ? goalTags?.repeats.value.trim() : null,
        goalTags.duration ? goalTags.duration.value : null,
        goalTags.start ? goalTags.start.value : null,
        goalTags.due ? goalTags.due.value : null,
        goalTags.afterTime ? goalTags.afterTime.value : null,
        goalTags.beforeTime ? goalTags.beforeTime.value : null,
        0,
        goalID,
        selectedGoal?.goal.goalColor, // goalColor
        goalLang,
        goalTags.link ? goalTags?.link?.value.trim() : null
      );
      newGoalId = await addGoal(newGoal);
    }
    if (goalID !== -1) {
      const parentGoal = await getGoal(goalID);
      const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
      await updateGoal(goalID, { sublist: newSublist });
    }
    setSelectedGoal(null);
    alert(newGoalId ? "Added!" : "Sorry!");
  };

  const getSuggestions = (isArchiveTab: boolean) => {
    const lst: ISharedGoal[] = isArchiveTab ? archiveGoals : publicGoals;
    return lst.length > 0 ?
      lst.map((goal, index) => (
        <div>
          <div
            onClick={() => setSelectedGoal(selectedGoal?.index === index ? null : { index, goal })}
            key={`my-archive-${goal.id}`}
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
              <img alt="goal suggestion" src={plus} />
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
      ))
      : (
        <div style={{ textAlign: "center" }} className="suggestions-goal-name">
          <p style={{ marginBottom: 0, padding: "2%", color: "black" }}>
            {
                isArchiveTab ? "Sorry, No Archived Goals" : "Sorry, No Public Goals"
                }
          </p>
        </div>
      );
  };

  const getMySuggestions = async () => {
    console.log(showSuggestionsModal);
    if (showSuggestionsModal === "Archive") {
      const goals: GoalItem[] = await getGoalsFromArchive(goalID);
      console.log(goals);
      setArchiveGoals([...goals]);
    } else if (showSuggestionsModal === "Public") {
      let goal: GoalItem;

      if (goalID !== -1) goal = await getGoal(goalID);
      const res = await getPublicGoals(goalID === -1 ? "root" : goal.title);
      if (res.status) {
        const tmpPG = [...res.data];
        setPublicGoals([...tmpPG]);
      }
    }
  };

  useEffect(() => {
    getMySuggestions();
  }, [showSuggestionsModal]);

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
      const tmp = `${goal.title}${goal.duration ? ` ${goal.duration}hours` : ""}${goal.start ? ` start ${goal.start.getDate()}/${goal.start.getMonth() + 1}` : ""}${goal.due ? ` due ${goal.due.getDate()}/${goal.due.getMonth() + 1}` : ""}${goal.repeat ? ` ${goal.repeat}` : ""}${tmpTiming}${goal.link ? ` ${goal.link}` : ""}`;
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
  return (

    <Modal
      id="suggestions-modal"
      show={showSuggestionsModal !== null}
      onHide={() => setShowSuggestionsModal(null)}
      centered
      autoFocus={false}
    >
      <Modal.Body id="suggestions-modal-body">
        <p id="archive-title">
          { showSuggestionsModal === "Public" && "Add from Public" }
          { showSuggestionsModal === "Archive" && "Add from Archive"}
        </p>
        <div style={{ height: "35vh", overflow: "scroll" }}>
          {getSuggestions(showSuggestionsModal === "Archive")}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SuggestionModal;
