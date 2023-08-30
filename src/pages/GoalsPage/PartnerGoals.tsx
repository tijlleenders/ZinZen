/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState, useEffect, ChangeEvent } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import ZinZenTextLight from "@assets/images/LogoTextLight.svg";
import ZinZenTextDark from "@assets/images/LogoTextDark.svg";

import { GoalItem } from "@src/models/GoalItem";
import { GoalSublist } from "@components/GoalsComponents/GoalSublist/GoalSublist";
import { displayGoalActions, displayGoalId } from "@src/store/GoalsState";
import MyGoal from "@components/GoalsComponents/MyGoal";
import GoalLocStateHandler from "@src/helpers/GoalLocStateHandler";
import AppLayout from "@src/layouts/AppLayout";
import GoalsList from "@components/GoalsComponents/GoalsList";
import ZAccordion from "@src/common/Accordion";
import MyGoalActions from "@components/GoalsComponents/MyGoalActions/MyGoalActions";

import { darkModeState, lastAction, searchActive } from "@src/store";

const PartnerGoals = ({
  partnerGoals,
  refreshGoals,
}: {
  partnerGoals: GoalItem[];
  refreshGoals: () => Promise<void>;
}) => {
  let debounceTimeout: ReturnType<typeof setTimeout>;
  const [activeGoals, setActiveGoals] = useState<GoalItem[]>([]);
  const [archivedGoals, setArchivedGoals] = useState<GoalItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const displaySearch = useRecoilValue(searchActive);
  const selectedGoalId = useRecoilValue(displayGoalId);
  const darkModeStatus = useRecoilValue(darkModeState);
  const showGoalActions = useRecoilValue(displayGoalActions);

  const [action, setLastAction] = useRecoilState(lastAction);

  const handleUserGoals = (goals: GoalItem[]) => {
    setActiveGoals([...goals.filter((goal) => goal.archived === "false")]);
    setArchivedGoals([...goals.filter((goal) => goal.archived === "true" && goal.typeOfGoal === "myGoal")]);
  };
  const refreshActiveGoals = async () => {
    handleUserGoals(partnerGoals);
  };
  const search = async (text: string) => {
    handleUserGoals(partnerGoals.filter((goal) => goal.title.toUpperCase().includes(text.toUpperCase())));
  };
  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      search(event.target.value);
    }, 300);
  };

  useEffect(() => {
    if (action !== "none") {
      setLastAction("none");
      refreshGoals();
    }
  }, [action]);

  useEffect(() => {
    if (selectedGoalId === "root") {
      refreshActiveGoals();
    }
  }, [selectedGoalId, displaySearch]);

  useEffect(() => {
    handleUserGoals(partnerGoals)
  }, [partnerGoals])

  return (
    <AppLayout title="mygoals" debounceSearch={debounceSearch}>
      <GoalLocStateHandler />
      {showGoalActions && <MyGoalActions open={!!showGoalActions} goal={showGoalActions} />}
      <div className="myGoals-container">
        {selectedGoalId === "root" ? (
          <div className="my-goals-content">
            <div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <GoalsList
                  goals={activeGoals}
                  showActions={showActions}
                  setShowActions={setShowActions}
                  setGoals={setActiveGoals}
                />
              </div>
              <div className="archived-drawer">
                {archivedGoals.length > 0 && (
                  <ZAccordion
                    showCount
                    style={{
                      border: "none",
                      background: darkModeStatus ? "var(--secondary-background)" : "transparent",
                    }}
                    panels={[
                      {
                        header: "Done",
                        body: archivedGoals.map((goal: GoalItem) => (
                          <MyGoal
                            key={`goal-${goal.id}`}
                            goal={goal}
                            showActions={showActions}
                            setShowActions={setShowActions}
                          />
                        )),
                      },
                    ]}
                  />
                )}
              </div>
            </div>
          </div>
        ) : (
          <GoalSublist />
        )}
        {activeGoals?.length === 0 && (
          <img
            style={{ width: 350, height: 350, opacity: 0.3 }}
            src={darkModeStatus ? ZinZenTextDark : ZinZenTextLight}
            alt="Zinzen"
          />
        )}
      </div>
    </AppLayout>
  );
};

export default PartnerGoals;
