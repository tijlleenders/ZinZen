import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { Modal } from "react-bootstrap";

import plus from "@assets/images/plus.svg";

import { addGoal, createGoal, getGoal, getGoalsFromArchive, getPublicGoals, updateGoal } from "@src/api/GoalsAPI";
import { TagsExtractor } from "@src/helpers/TagsExtractor";
import { ISharedGoal } from "@src/Interfaces/ISharedGoal";
import ITagExtractor, { ITags } from "@src/Interfaces/ITagExtractor";
import { displayAddGoalOptions, displaySuggestionsModal, extractedTitle, inputGoalTags } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState, displayFromOptions, displayLoader, displayToast } from "@src/store";
import InputGoal from "./InputGoal";

interface SuggestionModalProps {
  goalID: string,
}

const SuggestionModal: React.FC<SuggestionModalProps> = ({ goalID }) => {
  const [open, setOpen] = useState(false);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showAddGoalOptions = useRecoilValue(displayAddGoalOptions);
  const [selectedGoal, setSelectedGoal] = useState<{index: number, goal:ISharedGoal|GoalItem} | null>(null);
  const [goalLang, setGoalLang] = useState("en");
  const [archiveGoals, setArchiveGoals] = useState<GoalItem[]>([]);
  const [publicGoals, setPublicGoals] = useState<ISharedGoal[]>([]);
  const [goalInput, setGoalInput] = useState("");

  const setLoading = useSetRecoilState(displayLoader);
  const [showFromOptions, setShowFromOptions] = useRecoilState(displayFromOptions);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);
  const [showSuggestionsModal, setShowSuggestionsModal] = useRecoilState(displaySuggestionsModal);
  const setShowToast = useSetRecoilState(displayToast);

  const addSuggestedGoal = async (goal:ISharedGoal | GoalItem, index:number) => {
    let newGoalId;
    if (!selectedGoal) {
      if(goal.id) {
        newGoalId = await updateGoal(goal.id, {status: 0});
        const goals: GoalItem[] = await getGoalsFromArchive(goalID);
        setArchiveGoals([...goals]);
      } else {
        const newGoal = { ...goal, parentGoalId: goalID, sublist: [], status: 0, collaboration: { status: "none", newUpdates: false }, shared: null };
        newGoalId = await addGoal(newGoal);
      }
    } else if (selectedGoal.index !== index) {
      setSelectedGoal(null);
      return;
    } else {
      try {
        const newGoal = createGoal(
          goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
          goalTags.repeats ? goalTags?.repeats.value.trim() : null,
          goalTags.duration ? goalTags.duration.value : null,
          goalTags.start ? goalTags.start.value : null,
          goalTags.due ? goalTags.due.value : null,
          goalTags.afterTime ? goalTags.afterTime.value : null,
          goalTags.beforeTime ? goalTags.beforeTime.value : null,
          goalLang,
          goalTags?.link?.value ? goalTags.link.value.trim() : null,
          0,
          goalID,
          selectedGoal?.goal.goalColor, // goalColor
        );
        newGoalId = await addGoal(newGoal);
      } catch (e) {
        console.log(e)
      }
    }
    if (goalID !== "root") {
      const parentGoal = await getGoal(goalID);
      const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
      await updateGoal(goalID, { sublist: newSublist });
    }
    setSelectedGoal(null);
  };

  const getSuggestions = (isArchiveTab: boolean) => {
    const lst: ISharedGoal[] | GoalItem[] = isArchiveTab ? archiveGoals : publicGoals;
    
    if(lst.length === 0) {
      return <div style={{ textAlign: "center" }} className="suggestions-goal-name">
        <p style={{ marginBottom: 0, padding: "2%", color: "black" }}>
          {
            isArchiveTab ? "Sorry, No Archived Goals" : "Sorry, No Public Goals"
          }
        </p>
      </div>
    }
    
    return lst.map((goal, index) => (
        <div key={`my-archive-${goal.id}`}>
          <div
            onClick={() => setSelectedGoal(selectedGoal?.index === index ? null : { index, goal })}
            className="suggestions-goal-name"
            style={{ backgroundColor: goal.goalColor }}
          >
            <p style={{ marginBottom: 0 }}>{goal.title}</p>
            <button
              type="button"
              onClickCapture={async (e) => {
                e.stopPropagation();
                await addSuggestedGoal(goal, index);
              }}
            >
              <img alt="goal suggestion" src={plus} style={{ filter: "brightness(0) invert(1)" }} />
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
  };

  const getMySuggestions = async () => {
    setLoading(true);
    const goals: GoalItem[] = await getGoalsFromArchive(goalID);
    const res = await getPublicGoals(goalID === "root" ? "root" : (await getGoal(goalID)).title);
    setArchiveGoals([...goals]);
    let publicGoalsEmpty = true;
    const archiveGoalsEmpty = goals.length === 0;
    if (res.status) {
      const tmpPG = [...res.data];
      publicGoalsEmpty = tmpPG.length === 0;
      setPublicGoals([...tmpPG]);
    }
    setShowFromOptions({ ...showFromOptions, archive: !archiveGoalsEmpty, public: !publicGoalsEmpty });
    setLoading(false);
  };

  useEffect(() => {
    if (showAddGoalOptions) {
      getMySuggestions();
    }
  }, [showAddGoalOptions]);

  useEffect(() => {
    if (showSuggestionsModal === "Archive") {
      setOpen(true);
    } else if (showSuggestionsModal === "Public") {
      if (showFromOptions.public) {
        setOpen(true);
      } else {
        setShowToast({ open: true, message: "Awww... no hints today. We'll keep looking!", extra: "" });
        setShowSuggestionsModal(null);
        setShowFromOptions({ archive: false, public: false });
      }
    }
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
      setGoalTags({} as ITags);
    }
  }, [selectedGoal]);
  
  return (
    <Modal
      id={`suggestions-modal${darkModeStatus ? "-dark" : ""}`}
      show={open}
      onHide={() => { setOpen(false); setShowSuggestionsModal(null); setShowFromOptions({ archive: false, public: false }); }}
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
