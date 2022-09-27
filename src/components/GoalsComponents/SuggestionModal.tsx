import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { Modal, Tab, Tabs } from "react-bootstrap";

import plus from "@assets/images/plus.svg";
import LogoGradient from "@assets/images/LogoGradient.png";

import { addGoal, createGoal, getGoal, updateGoal } from "@src/api/GoalsAPI";
import { TagsExtractor } from "@src/helpers/TagsExtractor";
import { ISharedGoal } from "@src/Interfaces/ISharedGoal";
import { extractedTitle, inputGoalTags } from "@src/store/GoalsHistoryState";
import ITagExtractor from "@src/Interfaces/ITagExtractor";
import InputGoal from "./InputGoal";

const SuggestionModal = ({
    goalID,
    showSuggestionsModal,
    setShowSuggestionsModal,
    archiveGoals,
    publicGoals
}) => {
    const [selectedGoal, setSelectedGoal] = useState<{index: number, goal:ISharedGoal} | null>(null);
    const [goalLang, setGoalLang] = useState("en");
            
    const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
    const [goalInput, setGoalInput] = useState("")
    const [goalTags, setGoalTags] = useRecoilState(inputGoalTags)

    const addSuggestedGoal = async (goal:ISharedGoal, index:number) => {
        let newGoalId;
        if(!selectedGoal) {
            const { id: prevId, ...newGoal } = { ...goal, parentGoalId: goalID, sublist: null, status: 0 };
            newGoalId = await addGoal(newGoal);
        }   
        else if(selectedGoal.index !== index) {
            setSelectedGoal(null);
            return;
        } 
        else  { 
            const newGoal = createGoal(
                goalTitle.split(" ").filter((ele) => ele !== "").join(" "),
                goalTags.repeats ? goalTags?.repeats.value.trim() : null,
                goalTags.duration ? goalTags.duration.value : null,
                goalTags.start ? goalTags.start.value : null,
                goalTags.due ? goalTags.due.value : null,
                goalTags.startTime ? goalTags.startTime.value : null,
                goalTags.endTime ? goalTags.endTime.value : null,
                0,
                goalID,
                selectedGoal?.goal.goalColor, // goalColor
                goalLang,
                goalTags.link ? goalTags?.link?.value.trim() : null
            );
            newGoalId = await addGoal(newGoal);
        };
        if (goalID !== -1) {
            const parentGoal = await getGoal(goalID);
            const newSublist = parentGoal && parentGoal.sublist ? [...parentGoal.sublist, newGoalId] : [newGoalId];
            await updateGoal(goalID, { sublist: newSublist });
        }
        setSelectedGoal(null);
        alert(newGoalId ? "Added!" : "Sorry!");
    }
    const getSuggestions = (isArchiveTab: boolean) => {
        const lst: ISharedGoal[] = isArchiveTab ? archiveGoals : publicGoals;
        return lst.length > 0 ?
            lst.map((goal, index) => (
            <div>
                <div 
                    onClick={() => setSelectedGoal(selectedGoal?.index === index ? null : {index, goal})}
                    key={`my-archive-${goal.id}`} className="suggestions-goal-name">
                    <p style={{ marginBottom: 0 }}>{goal.title}</p>
                    <button 
                        type="button" 
                        onClickCapture={(e) => { 
                            e.stopPropagation();
                            addSuggestedGoal(goal, index); 
                        }}>
                    <img alt="goal suggestion" src={plus} />
                    </button>
                </div>
                { goalInput!=='' && selectedGoal?.index === index &&  
                  <InputGoal 
                    goalInput={goalInput}
                    selectedColor={goal.goalColor ? goal.goalColor : "#FFFFFF"}
                    goalLang = {goalLang}
                    goalTags={goalTags}
                    setGoalTags={setGoalTags}
                    setGoalTitle={setGoalTitle}
                  />
                }
            </div>
            ))
            : (
            <div style={{ textAlign: "center" }} className="suggestions-goal-name">
                <p style={{ marginBottom: 0, padding: "2%" }}>
                {
                isArchiveTab ? "Sorry, No Archived Goals" : "Sorry, No Public Goals"
                }
                </p>
            </div>
            );
    };

    useEffect(() => {
        if(selectedGoal) {
          const { goal } = selectedGoal;
          let tmpTiming = "";
          if (goal.startTime && goal.endTime) {
            tmpTiming = ` ${goal.startTime}-${goal.endTime}`;
          } else if (goal.startTime) {
            tmpTiming = ` after ${goal.startTime}`;
          } else if (goal.endTime) {
            tmpTiming = ` before ${goal.endTime}`;
          }
          const tmp:string = `${goal.title}${goal.duration ? ` ${goal.duration}hours` : ""}${goal.start ? ` start ${goal.start.getDate()}/${goal.start.getMonth() + 1}` : ""}${goal.due ? ` due ${goal.due.getDate()}/${goal.due.getMonth() + 1}` : ""}${goal.repeat ? ` ${goal.repeat}` : ""}${tmpTiming}${goal.link ? ` ${goal.link}` : ""}`;
          setGoalInput(tmp);
          const output: ITagExtractor = TagsExtractor(tmp);
          if (output.occurences.length > 0) setGoalTitle(goalInput.slice(0, output.occurences[0].index));
          else setGoalTitle(goalInput.trim());
          setGoalTags(output.tags);
            // setMagicIndices(output.occurences);
          if (goal.language) setGoalLang(goal.language);
        }
        else {
            setGoalInput('')
            setGoalTitle('')
            setGoalTags({})
        }
      }, [selectedGoal]);


    return (

        <Modal
            id="suggestions-modal"
            show={showSuggestionsModal}
            onHide={() => setShowSuggestionsModal(false)}
            centered
            autoFocus={false}
        >
            <Modal.Body id="suggestions-modal-body">
                <button type="button" id="suggestions-modal-icon" onClick={() => { setShowSuggestionsModal(true); }}>
                    <img alt="create-goals-suggestion" src={LogoGradient} />
                    <div>?</div>
                </button>
                <Tabs
                    defaultActiveKey="My Archive"
                    id="suggestions"
                    className="mb-3"
                    justify
                >
                    <Tab eventKey="My Archive" title="My Archive">
                        {getSuggestions(true)}
                    </Tab>
                    <Tab eventKey="Public Goals" title="Public Goals">
                        {getSuggestions(false)}
                    </Tab>
                </Tabs>
            </Modal.Body>
        </Modal>  
    )
}

export default SuggestionModal