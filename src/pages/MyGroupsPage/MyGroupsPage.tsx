import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import ArrowIcon from "@assets/images/ArrowIcon.svg";

import MyPoll from "@components/GroupComponents/MyPoll";
import MyGroup from "@components/GroupComponents/MyGroup";
import AddGroup from "@components/GroupComponents/AddGroup";
import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { findPublicGroupsOnline } from "@src/services/group.service";
import { darkModeState, lastAction, searchActive } from "@src/store";
import { getAllPublicGroups, getPublicGroup } from "@src/api/PublicGroupsAPI";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { displayAddPublicGroup, displayExploreGroups, displayGroup } from "@src/store/GroupsState";

const MyGroupsPage = () => {
  const action = useRecoilValue(lastAction);
  const displaySearch = useRecoilValue(searchActive);
  const darkModeStatus = useRecoilValue(darkModeState);
  const [selectedGroup, setSelectedGroup] = useRecoilState(displayGroup);

  const [userGroups, setUserGroups] = useState<PublicGroupItem[]>([]);
  const [exploreGroups, setExploreGroups] = useState<PublicGroupItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const [openAddGroup, setOpenAddGroup] = useRecoilState(displayAddPublicGroup);
  const [openExploreGroups, setOpenExploreGroups] = useRecoilState(displayExploreGroups);

  const renewSelectedGroup = async () => {
    if (selectedGroup) {
      setSelectedGroup({ ...(await getPublicGroup(selectedGroup.id)) });
    }
  };
  const fetchGroups = async () => {
    await renewSelectedGroup();
    const mygroups = await getAllPublicGroups();
    findPublicGroupsOnline().then(async (res) => {
      if (res.success) {
        const myGroupsIds = mygroups.map((group) => group.id);
        setExploreGroups([...res.response.filter((group: PublicGroupItem) => !myGroupsIds.includes(group.id))]);
      }
    });
    setUserGroups([...mygroups]);
  };

  useEffect(() => {
    fetchGroups();
  }, []);
  useEffect(() => {
    if (action.includes("group")) {
      fetchGroups();
    } else if (action === "pollAdded") {
      renewSelectedGroup();
    }
  }, [action]);
  return (
    <>
      <MainHeaderDashboard />
      <div className="myGoals-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="my-goals-content">
          { !displaySearch && (
          <div className="sec-header" style={selectedGroup ? { justifyContent: "center" } : {}}>
            {selectedGroup ? (
              <div className="sublist-title" style={{ width: "100%" }}>
                <button
                  type="button"
                  className="nav-icon"
                  onClick={() => { setSelectedGroup(null); }}
                >
                  <img alt="zinzen my goals" src={ArrowIcon} />
                </button>
                <p>  {selectedGroup.title}</p>
              </div>
            ) : (
              <>
                { openAddGroup ? (
                  <button
                    type="button"
                    className="back nav-icon"
                    style={{ marginTop: "6px" }}
                    onClick={() => { setOpenAddGroup(false); }}
                  >
                    <img alt="zinzen my goals" src={ArrowIcon} />
                  </button>
                ) : (
                  <button type="button" onClick={() => { setOpenExploreGroups(false); }}>
                    <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${openExploreGroups ? "" : "activeTab"}`}>
                      My Groups
                    </h1>
                  </button>
                )}
                <button type="button" onClick={() => { setOpenExploreGroups(true); }}>
                  <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${!openExploreGroups ? "" : "activeTab"}`}>
                    Explore
                  </h1>
                </button>
              </>
            )}
          </div>
          )}
          <div>
            {openAddGroup && <AddGroup />}
            { !openExploreGroups && userGroups.length === 0 &&
            <p className={`myGoals_title${darkModeStatus ? "-dark" : ""}`}>You don&apos;t have any group. Create one...</p>}
            { !selectedGroup ?
              (openExploreGroups ? exploreGroups : userGroups).map((group) => (
                <MyGroup
                  key={`group-${group.id}`}
                  group={group}
                />
              ))
              :
              selectedGroup.polls && selectedGroup.polls.map((poll) => (
                <MyPoll
                  key={`poll-${poll.id}`}
                  poll={poll}
                  showActions={showActions}
                  setShowActions={setShowActions}
                />
              ))}
          </div>
        </div>

      </div>
    </>
  );
};

export default MyGroupsPage;
