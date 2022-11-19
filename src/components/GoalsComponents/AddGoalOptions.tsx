import React from "react";
import { useSetRecoilState } from "recoil";

import add from "@assets/images/add.svg";
import publicGoal from "@assets/images/publicGoal.svg";
import archiveGoals from "@assets/images/archiveGoals.svg";
import { displayAddGoal, displaySuggestionsModal } from "@src/store/GoalsState";

const AddGoalOptions = ({ parentGoalId }: {parentGoalId: string}) => {
  const setShowAddGoal = useSetRecoilState(displayAddGoal);
  const setShowSuggestionsModal = useSetRecoilState(displaySuggestionsModal);
  return (
    <div id="addGoal-options">
      <button
        type="button"
        onClick={() => setShowAddGoal({ open: true, goalId: parentGoalId })}
      >
        New
        <img alt="create-goals-suggestion" src={add} />
      </button>
      <button
        type="button"
        onClick={() => { setShowSuggestionsModal("Archive"); }}
      >
        Archive
        <img alt="create-goals-suggestion" src={archiveGoals} />
      </button>
      <button
        type="button"
        onClick={() => { setShowSuggestionsModal("Public"); }}
      >
        Public
        <img alt="create-goals-suggestion" src={publicGoal} />
      </button>
    </div>
  );
};

export default AddGoalOptions;
