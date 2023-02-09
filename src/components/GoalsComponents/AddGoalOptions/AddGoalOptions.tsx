import React, { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import publicGoals from "@assets/images/publicGoals.svg";
import archiveGoalsIcon from "@assets/images/archiveGoals.svg";

import Loader from "@src/common/Loader";
import { GoalItem } from "@src/models/GoalItem";
import { darkModeState, displayToast } from "@src/store";
import { displayAddGoal, displaySuggestionsModal } from "@src/store/GoalsState";
import { getGoal, getGoalsFromArchive } from "@src/api/GoalsAPI";
import { getPublicGoals } from "@src/services/goal.service";

import "./AddGoalOptions.scss";

const AddGoalOptions = ({ parentGoalId }: {parentGoalId: string}) => {
  const [loading, setLoading] = useState(false);
  const [empty, setEmpty] = useState({ P: true });

  const darkModeStatus = useRecoilValue(darkModeState);
  const setShowToast = useSetRecoilState(displayToast);
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
        <button type="button">
          <img
            style={!darkModeStatus ? { filter: "invert(68%) sepia(40%) saturate(4205%) hue-rotate(325deg) brightness(87%) contrast(82%)" } : {}}
            alt="create-goals-suggestion"
            src={plus}
          />
        </button>
      </button>
      <button
        type="button"
        disabled={loading}
        className="addGoal-option"
        onClick={async () => {
          setLoading(true);
          const res = await getPublicGoals(parentGoalId === "root" ? "root" : (await getGoal(parentGoalId)).title);
          if (res.status && res.data?.length > 0) {
            const tmpPG = [...res.data];
            setEmpty({ ...empty, P: tmpPG.length === 0 });
            setShowSuggestionsModal({ selected: "Public", goals: [...tmpPG] });
          } else {
            setShowToast({ open: true, message: "Awww... no hints today. We'll keep looking!", extra: "" });
          }
          setLoading(false);
        }}
      >
        Hint
        <button
          type="button"
          disabled={loading}
        >
          <img alt="create-goals-suggestion" src={publicGoals} />
          { loading && <Loader /> }
        </button>
      </button>
    </div>
  );
};

export default AddGoalOptions;
