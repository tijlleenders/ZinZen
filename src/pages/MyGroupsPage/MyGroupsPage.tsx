import React, { useEffect, useState } from "react";

import { UpdateGoalForm } from "@components/GoalsComponents/UpdateGoal/UpdateGoalForm";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";
import { GoalItem } from "@src/models/GoalItem";
import { PublicGroupItem } from "@src/models/PublicGroupItem";
import MyGroup from "@components/GroupComponents/MyGroup";
import { findPublicGroups } from "@src/services/group.service";

const MyGroupsPage = () => {
  const [userGroups, setUserGroups] = useState<{ publicGroupId: string, title: string }[]>([]);
  const [showActions, setShowActions] = useState({ open: "root", click: 1 });

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await findPublicGroups();
      if (res.success) { setUserGroups([...res.response]); }
    };
    fetchGroups();
  }, []);
  return (
    <>
      <MainHeaderDashboard />
      <div className="myGoals-container" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="my-goals-content">
          <div>
            {userGroups.map((group) => (
              <MyGroup
                key={`group-${group.publicGroupId}`}
                group={group}
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
