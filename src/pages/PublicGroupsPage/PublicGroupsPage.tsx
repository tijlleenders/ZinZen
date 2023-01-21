/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { darkModeState } from "@src/store";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { getRootGroupGroups } from "@api/PublicGroupsAPI";
import { RetrievePublicGroupGoalItem } from "@src/models/RetrievePublicGroupGoalItem";
import MyGroup from "@components/MyGroup";

import "./PublicGroupsPage.scss";

export const PublicGroupsPage = () => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showActions, setShowActions] = useState({ open: "56057db3-c50f-5fc9-9cdd-de991a592d16", click: 1 });
  const [navGroups, setNavGroups] = useState(true);
  let debounceTimeout: ReturnType<typeof setTimeout>;
  const [exploreGroups, setExploreGroups] = useState<retrRetrievePublicGroupGoalItem[]>();

  const array = [
    {
      inMyGoals: 1,
      feelGoods: 0,
      dislikes: 0,
      id: "56057db3-c50f-5fc9-9cdd-de991a592d16",
      completed: 0,
      title: "Public Group 2",
      feelBads: 1,
      parentId: "ffee4830-a840-5b5e-884c-fd373d6023a5",
      likes: 1,
    },
    {
      inMyGoals: 1,
      feelGoods: 0,
      dislikes: 0,
      id: "56057db3-c50f-5fc9-9cdd-de991a592123",
      completed: 0,
      title: "Public Group 4",
      feelBads: 1,
      parentId: "ffee4830-a840-5b5e-884c-fd373d6023a5",
      likes: 1,
    },
    {
      inMyGoals: 1,
      feelGoods: 0,
      dislikes: 0,
      id: "56057db3-c50f-5fc9-92dd-de991a599123",
      completed: 0,
      title: "New Group",
      feelBads: 1,
      parentId: "ffee4830-a840-5b5e-884c-fd373d6023a5",
      likes: 1,
    },
  ];
  useEffect(() => {
    setExploreGroups(array);

    // (async () => {
    //   const rootGroups: RetrievePublicGroupGoalItem[] = await getRootGroupGroups();
    //   setExploreGroups(rootGroups);
    // })();
  }, []);
  const search = async (text: string) => {
    // const groups: RetrievePublicGroupGoalItem[] = await getRootGroupGroups();
    setExploreGroups(array.filter((group) => group.title.toUpperCase().includes(text.toUpperCase())));
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
              onClick={() => setNavGroups(!navGroups)}
            >
              {navGroups ? t("exploregroups") : t("mygroups")}
            </h1>
          </div>
          <div>
            {exploreGroups?.map((rootGroup: RetrievePublicGroupGoalItem) => (
              // eslint-disable-next-line react/jsx-key
              <MyGroup group={rootGroup} showActions={showActions} setShowActions={setShowActions} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
