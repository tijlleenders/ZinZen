import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import addIcon from "@assets/images/plus.svg";

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
  const darkModeStatus = useRecoilValue(darkModeState);
  const [selectedGroup, setSelectedGroup] = useRecoilState(displayGroup);

  const [userGroups, setUserGroups] = useState<PublicGroupItem[]>([]);
  const [exploreGroups, setExploreGroups] = useState<PublicGroupItem[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  const [displaySearch, setDisplaySearch] = useRecoilState(searchActive);
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
    console.log("gr", mygroups);
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
            {selectedGroup ? <p className="sublist-title">{selectedGroup.title}</p> : (
              <>
                <button type="button" onClick={() => { setOpenExploreGroups(false); }}>
                  <h1 className={`myGoals_title${darkModeStatus ? "-dark" : ""} ${openExploreGroups ? "" : "activeTab"}`}>
                    My Groups
                  </h1>
                </button>
                <button type="button" onClick={() => { setDisplaySearch(true); }}>
                  <img
                    alt="search goal"
                    style={{ width: "35px", marginTop: "10px", height: "30px" }}
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAACXBIWXMAAAsTAAALEwEAmpwYAAAEiElEQVR4nO2WWUhjVxjHb0ppC31oaQvzVJzqQKGFUltsC+3UvpT2rYU+1IGOUig+mGjcTW6W660YZcqMWVpFx5ukhiRqxiUoopAxNe4bcauJqRvquC9xi8Zx+pXv0CtWBqaQTEPBDw4n5yZwfvf//3/nhKIuKzwlyMvLe4mKVBUXF3/Esmwpy7LDhYWF3qKioqmCggKvUqnso2m6SCKRXHvqEHa7/QrHcfc0Gs0flZWVgerqamhoaAC73U5ms9kMFRUVuyqVyiOVSjUMw7zwVECCweDb3d3dbr1ef9jY2AhdXV0wMzMDa2trsLOzAysrK+D1esHpdEJdXR2UlpZu0jTdwTDMa2EFcTgcVwYHB91VVVUnbW1tZNONjQ3Y29uDQCAAR0dHcHh4CLu7u7C+vg5jY2PQ3NyMKu3TNH2fYZjnwgZjMpnu6fX6AwSZmJggG/r9fgKAIMfHx2Q+ODg4U8ntdkNTUxPodLoVmqYVYQFRqVQfarVaH1ozMDAACwsLsL29TTZGVRCEHwi0v78Pm5ubMDs7C729vVBTUwMsy3okEsmrIcPIZLJfOI47bG9vh8nJSVheXj6zJxgMknFyckIGfka1ULWlpSUYHx8HVPNvdX4IGUYqlQ5ZrVbo6+sjb4sWYTZQiYsgvDr4/erqKvh8Pujs7ASj0fiQpmlbqCwChULhxbYdHh6G+fl5YgFawVvEw+DANR9kDDjC9/f3Ax4BSqWyKySSrKysFxUKxRTmxe12n+XlPAyvznll0EaEmZubIznD3OTn5w+GqgxF0/RkfX09DA0NPVYZPjd8iPE53+KoDNprsVhAoVA4Q4ZJT0/vMZvNf2JnTE9Pk0PuYluf76bz7T01NQUulwsMBsOxUqk0hAwjFAoLysvL/Q6Hg5wxi4uLsLW1RazAjREK1cCBaz4vaOno6Ci0tLSAVqtdYFn2m5BhRCLRGzKZzGOz2Yjk2CHYtmgXKoRQOBACFUEQBPZ4PKSTLBbLI7VaPRK2eyolJeW2VqtdxyMeA4lA+OZoBUIhAGYE1/gcQdBW7EKO4/x373LfUeEqvFtSU1OdZWVlewjU09NDDjSEwssSuwZnzMjIyAhRBEHwwsTQa7Q/l1MUCMIGlJGR8UpaWlprSUnJA2xVPFkxnGgdqoVzR0cHyYjZbH5kNBr9Vms1sQzD3dLaWndHrdOEDYphmGdFIlFubm7u72q1+oHBYHiIbYtw+F9Gr9cfY1h1Ot2IyWS6UVtb+1NiYhKxLhAInG77hr3Jn72pw8OUCleJxeKXhUJhkkgksorF4t9ycnL6MzMzndnZ2ZVyufxrjUbzPP9bk8n0a0LCjdPxzjafKzN+a4z5ApKvx3AMRT1D/ddls9lu3WHlHvbT6K2qhFhwZcRDxIAAQJD0wbXborgo+DE+Bv4JFF0RVsv+ZQluxkZpHg8UGcsEl0BPqEuFnlSCm+9G6S6Gekj+OSR/HF1KRaAE54EM38aCJSkObn31znwkYM6AhHFRQH8SDRnXY04LvnwrlYpgCRJjr5Z8/97rs8nvX40oCPW/qb8A7SmdDJ0asswAAAAASUVORK5CYII="
                  />
                </button>
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
            { !openExploreGroups && !selectedGroup && !openAddGroup && (
            <button
              type="button"
              className={`addFeeling-btn${darkModeStatus ? "-dark" : ""}`}
              onClick={() => { setOpenAddGroup(true); }}
            >
              <input
                type="image"
                tabIndex={0}
                src={addIcon}
                alt="add-feeling"
              />
            </button>
            )}
            { !selectedGroup ?
              (openExploreGroups ? exploreGroups : userGroups).map((group) => (
                <MyGroup
                  key={`group-${group.id}`}
                  group={group}
                />
              ))
              :
              selectedGroup.polls.map((poll) => (
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
