/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";
import { getPublicGroupGoals, getUserGroups } from "@api/PublicGroupsAPI";
import { RetrievePublicGroupGoalItem } from "@src/models/RetrievePublicGroupGoalItem";
import MyGroup from "@components/MyGroup";

import "./PublicGroupsPage.scss";

export const PublicGroupsPage = () => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showActions, setShowActions] = useState({ open: "dad3e06f-eafe-5366-8145-e766d2a82783", click: 1 });
  const [navGroups, setNavGroups] = useState(true);
  let debounceTimeout: ReturnType<typeof setTimeout>;
  const [exploreGroups, setExploreGroups] = useState<RetrievePublicGroupGoalItem[]>();
  const [myGroups, setMyGroups] = useState<RetrievePublicGroupGoalItem[]>();
  const [activeGroups, setActiveGroups] = useState<RetrievePublicGroupGoalItem[]>(myGroups);

  useEffect(() => {
    (async () => {
      const allRootGroups = await getPublicGroupGoals("dad3e06f-eafe-5366-8145-e766d2a82783");
      const myRootGroups = await getUserGroups();
      setExploreGroups(allRootGroups);
      setMyGroups(myRootGroups);
      setActiveGroups(myRootGroups);
    })();
  }, [setMyGroups, setExploreGroups, setActiveGroups]);

  const search = async (text: string) => {
    if (navGroups) {
      setActiveGroups(myGroups.filter((group) => group.title.toUpperCase().includes(text.toUpperCase())));
    } else {
      setActiveGroups(exploreGroups.filter((group) => group.title.toUpperCase().includes(text.toUpperCase())));
    }
  };

  const debounceSearch = (event: ChangeEvent<HTMLInputElement>) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    debounceTimeout = setTimeout(() => {
      search(event.target.value);
    }, 300);
  };

  return (
    <>
      <MainHeaderDashboard />
      <div className="public-groups-container">
        <div className="public-groups-content">
          <input
            id={darkModeStatus ? "public-groups-searchBar-dark" : "public-groups-searchBar"}
            placeholder={t("search")}
            onChange={(e) => debounceSearch(e)}
          />
          <div className="public-groups-nav-container">
            <h1 type="button" id={darkModeStatus ? "left-groups-nav-dark" : "left-groups-nav"}>
              {navGroups ? t("mygroups") : t("exploregroups")}
            </h1>
            <h1
              type="button"
              id={!darkModeStatus ? "right-groups-nav-dark" : "right-groups-nav"}
              onClick={() => {
                if (!navGroups) {
                  setActiveGroups(myGroups);
                } else {
                  setActiveGroups(exploreGroups);
                }
                setNavGroups(!navGroups);
              }}
            >
              {navGroups ? t("exploregroups") : t("mygroups")}
            </h1>
          </div>
          <div>
            {activeGroups?.map((rootGroup: RetrievePublicGroupGoalItem) => (
              // eslint-disable-next-line react/jsx-key
              <MyGroup group={rootGroup} showActions={showActions} setShowActions={setShowActions} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
