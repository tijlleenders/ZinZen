import React from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import publicGoals from "@assets/images/publicGoals.svg";
import archiveGoals from "@assets/images/archiveGoals.svg";

import { displayAddGoal, displaySuggestionsModal } from "@src/store/GoalsState";
import { darkModeState, displayFromOptions } from "@src/store";

const AddGoalOptions = ({ parentGoalId }: {parentGoalId: string}) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const showFromOptions = useRecoilValue(displayFromOptions);
  const setShowAddGoal = useSetRecoilState(displayAddGoal);
  const setShowSuggestionsModal = useSetRecoilState(displaySuggestionsModal);
  return (
    <div id={`addGoal-options${darkModeStatus ? "-dark" : ""}`}>
      <button
        type="button"
        className="addGoal-option"
        onClick={() => setShowAddGoal({ open: true, goalId: parentGoalId })}
      >
        New
        <div>
          <img
            style={!darkModeStatus ? { filter: "invert(68%) sepia(40%) saturate(4205%) hue-rotate(325deg) brightness(87%) contrast(82%)" } : {}}
            alt="create-goals-suggestion"
            src={plus}
          />
        </div>
      </button>
      { showFromOptions.archive && (
      <button
        type="button"
        className="addGoal-option"
        onClick={() => { setShowSuggestionsModal("Archive"); }}
      >
        Archive
        <div><img alt="create-goals-suggestion" src={archiveGoals} /></div>
      </button>
      ) }
      <button
        type="button"
        className="addGoal-option"
        onClick={() => { setShowSuggestionsModal("Public"); }}
      >
        Hint
        <div><img alt="create-goals-suggestion" src={publicGoals} /></div>
      </button>
    </div>
  );
};

export default AddGoalOptions;
