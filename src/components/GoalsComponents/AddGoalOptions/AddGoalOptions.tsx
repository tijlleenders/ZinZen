import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import plus from "@assets/images/plus.svg";
import publicGoals from "@assets/images/publicGoals.svg";

import Loader from "@src/common/Loader";
import { getGoal } from "@src/api/GoalsAPI";
import { darkModeState, displayToast } from "@src/store";
import { getPublicGoals } from "@src/services/goal.service";
import { displayAddGoal, displaySuggestionsModal } from "@src/store/GoalsState";

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
