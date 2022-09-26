import React from 'react'
import add from "@assets/images/add.svg";
import publicGoal from "@assets/images/publicGoal.svg";
import archiveGoals from "@assets/images/archiveGoals.svg";
import { useRecoilState } from 'recoil';
import { displayAddGoal } from '@src/store/GoalsHistoryState';

function AddGoalOptions({ parentGoalId }: {parentGoalId: number}) {
  const [showAddGoal, setShowAddGoal] = useRecoilState(displayAddGoal);
  return (
    <div id="addGoal-options">
        <button
          type="button"
          onClick={() => setShowAddGoal({open: true, goalId: parentGoalId})}
        >
          New
          <img alt="create-goals-suggestion" src={add} />
        </button>
        <button
          type="button"
        >
          Archive
          <img alt="create-goals-suggestion" src={archiveGoals} />
        </button>
        <button
          type="button"
        >
          Public
          <img alt="create-goals-suggestion" src={publicGoal} />
        </button>
    </div>  
  )
}

export default AddGoalOptions