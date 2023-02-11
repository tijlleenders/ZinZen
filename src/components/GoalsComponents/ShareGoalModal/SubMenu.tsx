import { addPollsInPublicGroup } from "@src/api/PublicGroupsAPI";
import { createPollObject } from "@src/helpers/GroupsProcessor";
import { GoalItem } from "@src/models/GoalItem";
import { PublicGroupItem } from "@src/models/PublicGroupItem";
import { sendUpdateOfNewPoll } from "@src/services/group.service";
import { displayToast } from "@src/store";
import React from "react";
import { useSetRecoilState } from "recoil";

export const SubMenuItem = ({ goal, group }: { goal: GoalItem, group: PublicGroupItem }) => {
  const setShowToast = useSetRecoilState(displayToast);
  return (
    <button
      style={{
        background: "transparent",
        border: "none",
        borderBottom: "0.4px solid #4A4A4A",
        padding: "10px",
        width: "100%"
      }}
      type="button"
      className="share-Options"
      onClick={async () => {
        if (group) {
          const poll = createPollObject(goal);
          await addPollsInPublicGroup(group.id, [poll]);
          const res = await sendUpdateOfNewPoll(group.id, poll);
          const message = res.success ? "Goal is shared successfully" : "failed to send add poll update";
          setShowToast({ open: true, message, extra: "" });
        }
      }}
    >
      <div style={{ fontSize: "1.4em", fontWeight: "500", marginRight: "15px", alignSelf: "center" }}>{group.title[0]}</div>
      <p style={{ alignSelf: "center", margin: 0, fontWeight: "500" }}>{group.title}</p>
    </button>
  );
};

const SubMenu = ({ children }) => <div>{children}</div>;

export default SubMenu;
