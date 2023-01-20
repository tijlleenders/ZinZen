/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { darkModeState } from "@src/store";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import "./PublicGroupsPage.scss";

export const PublicGroupsPage = () => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [exploreGroups, setExploreGroups] = useState<retrRetrievePublicGroupGoalItem[]>();

  //   useEffect(() => {
  //     (async () => {
  //       const goals: GoalItem[] = await getActiveGoals();
  //       setUserGoals(goals);
  //     })();
  //   }, []);

  return (
    <>
      <MainHeaderDashboard />
      <div className="public-groups-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="public-groups-content">
          <input
            id={darkModeStatus ? "public-groups-searchBar-dark" : "public-groups-searchBar"}
            placeholder={t("search")}
          />
          <div className="public-groups-exploreGroups-container">
            <h1 id={darkModeStatus ? "public-groups-exploreGroups-dark" : "public-groups-exploreGroups"}>
              {t("exploregroups")}
            </h1>
          </div>
          <div className="public-groups-myGroups-container">
            <h1 type="button" id={darkModeStatus ? "public-groups-myGroups-dark" : "public-groups-myGroups"}>
              {t("mygroups")}
            </h1>
          </div>
          {/* <div>
          {userGoals?.map((goal: GoalItem) => (
            showUpdateGoal?.goalId === goal.id ? <UpdateGoalForm updateThisGoal={updateThisGoal} />
              :
            <MyGoal goal={goal} showActions={showActions} setShowActions={setShowActions} setLastAction={setLastAction} />
          ))}
        </div> */}
        </div>
      </div>
    </>
  );
};
