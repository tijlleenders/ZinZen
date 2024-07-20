import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { displayChangesModal, displayGoalId, displaySuggestionsModal } from "@src/store/GoalsState";
import { GoalItem } from "@src/models/GoalItem";
import { getDeletedGoals } from "@src/api/TrashAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { lastAction } from "@src/store";
import { getHintRecord } from "@src/api/HintRecordAPI";
import { priotizeImpossibleGoals } from "@src/utils/priotizeImpossibleGoals";
import { useParentGoalContext } from "@src/contexts/parentGoal-context";
import { DeletedGoalProvider } from "@src/contexts/deletedGoal-context";
import DeletedGoals from "@pages/GoalsPage/components/DeletedGoals";
import ArchivedGoals from "@pages/GoalsPage/components/ArchivedGoals";
import { TrashItem } from "@src/models/TrashItem";

import GoalsList from "../GoalsList";
import GoalHistory from "./components/GoalHistory";

import "./GoalSublist.scss";
import BudgetSummary from "../../../common/GoalItemSummary/BudgetSummary";
import GoalSummary from "../../../common/GoalItemSummary/GoalSummary";

export const GoalSublist = () => {
  const {
    parentData: { parentGoal, subgoals },
    dispatch,
  } = useParentGoalContext();

  const { t } = useTranslation();
  const action = useRecoilValue(lastAction);
  const goalID = useRecoilValue(displayGoalId);
  const showChangesModal = useRecoilValue(displayChangesModal);
  const showSuggestionModal = useRecoilValue(displaySuggestionsModal);
  const [deletedGoals, setDeletedGoals] = useState<TrashItem[]>([]);
  const [archivedChildren, setArchivedChildren] = useState<GoalItem[]>([]);
  const [goalhints, setGoalHints] = useState<GoalItem[]>([]);

  useEffect(() => {
    getHintRecord(goalID).then((hintItem) => {
      const array: GoalItem[] = [];
      hintItem?.goalHints?.forEach((hint) => {
        if (hint) {
          array.push(createGoalObjectFromTags({ ...hint, parentGoalId: goalID }));
        }
      });
      setGoalHints(array || []);
    });
  }, [goalID, action]);

  useEffect(() => {
    getDeletedGoals(goalID).then((res) => {
      setDeletedGoals([...res]);
    });
  }, [goalID]);

  useEffect(() => {
    async function init() {
      const sortedGoals = await priotizeImpossibleGoals(subgoals);
      setArchivedChildren([...sortedGoals.filter((goal) => goal.archived === "true")]);
      getDeletedGoals(goalID).then((res) => {
        setDeletedGoals([...res]);
      });
    }
    console.log("refreshed goals");
    init();
  }, [action, parentGoal, showSuggestionModal, showChangesModal]);

  return (
    <div className="sublist-container">
      <GoalHistory />
      <div className="sublist-content-container">
        <div className="sublist-content">
          <p className="sublist-title">{parentGoal && t(parentGoal?.title)}</p>
          {parentGoal && (
            <span className="goal-item-summary-wrapper">
              {!parentGoal.timeBudget ? <BudgetSummary goal={parentGoal} /> : <GoalSummary goal={parentGoal} />}
            </span>
          )}
          <div className="sublist-list-container">
            <GoalsList
              goals={subgoals}
              setGoals={(orderedGoals: GoalItem[]) => {
                dispatch({ type: "SET_SUBGOALS", payload: orderedGoals });
              }}
            />
            <DeletedGoalProvider>
              {deletedGoals.length > 0 && <DeletedGoals goals={deletedGoals} />}
            </DeletedGoalProvider>
            {archivedChildren.length > 0 && <ArchivedGoals goals={archivedChildren} />}
          </div>
        </div>
      </div>
    </div>
  );
};
