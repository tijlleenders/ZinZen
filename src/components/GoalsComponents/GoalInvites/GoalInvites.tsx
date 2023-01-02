import React, { useEffect, useState } from "react";
import { Accordion, OverlayTrigger, Tooltip } from "react-bootstrap";

import { getAllContacts, removeGoalInRelId, sendResponseOfColabInvite } from "@src/api/ContactsAPI";

import "./GoalInvites.scss";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";
import { addGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";

interface shareInviteSchema {
    id: string,
    goal: GoalItem,
    relId: string,
    contactName: string,
}
const commonStyle = {
  margin: 0,
  fontWeight: "bolder",
  fontSize: "1.143em",
  color: "black",
  textAlign: "left",
};
const darkCommonStyle = {
  color: "white",
};
const contactIconStyle = {
  width: "20px",
  height: "20px",
  fontSize: "0.9em"
};
const choiceBtnStyle = {
  padding: "2px 20px",
  border: "none",
  borderRadius: "7px",
};

const GoalInvites = ({ invitesType }: { invitesType: string }) => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [invites, setInvites] = useState<shareInviteSchema[]>([]);
  const [showChoice, setShowChoice] = useState<string>("");
  const handleChoice = async (choice: string, index: number, goal: GoalItem) => {
    if (choice === "Add") {
      const thisGoal = invitesType === "sharedGoals" ? goal :
        { ...goal, collaboration: { status: "accepted", newUpdates: false }, shared: { newUpdates: false, relId: invites[index].relId, name: invites[index].contactName } };
      await addGoal(thisGoal);
    }
    if (invitesType === "collaboratedGoals") {
      sendResponseOfColabInvite(choice === "Add" ? "accepted" : "declined", invites[index].relId, goal.id).then(() => console.log("response sent"));
    }
    removeGoalInRelId(invites[index].relId, invites[index].id, invitesType === "sharedGoals" ? "sharedGoals" : "collaborativeGoals")
      .then(() => {
        invites.splice(index, 1);
        setInvites([...invites]);
      }).catch((err) => console.log("cant remove", err));
  };
  useEffect(() => {
    const getInvites = async () => {
      const contacts = await getAllContacts();
      const _invites: shareInviteSchema[] = [];
      contacts.forEach((ele) => {
        ele[invitesType === "sharedGoals" ? "sharedGoals" : "collaborativeGoals"].forEach((sg) => _invites.push({
          id: sg.id,
          relId: ele.relId,
          contactName: ele.name,
          goal: sg.goal
        }));
      });

      setInvites([..._invites]);
    };
    getInvites();
  }, []);
  return (
    <Accordion className={`Accordion${darkModeStatus ? "-dark" : ""}`} style={{ marginTop: "1.5em", padding: "5px 20px" }}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>
          <p style={{
            ...commonStyle,
            ...(darkModeStatus ? darkCommonStyle : {}) }}
          >
            { invitesType === "sharedGoals" ? "Shared with me" : "Collaboration invites" }
          </p>
        </Accordion.Header>
        <Accordion.Body>
          {invites.map((inv, index) => {
            const { title, goalColor } = inv.goal;
            return (
              <button
                type="button"
                key={inv.id}
                style={{ background: "transparent", border: "none", width: "100%" }}
                onClick={() => { setShowChoice(inv.id); }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: index === 0 ? 0 : "20px" }}>
                  <p style={{
                    ...commonStyle,
                    ...(darkModeStatus ? darkCommonStyle : {}),
                    fontWeight: 500 }}
                  >{title}
                  </p>
                  <OverlayTrigger
                    trigger="click"
                    placement="top"
                    overlay={<Tooltip id="tooltip-disabled"> {inv.contactName} </Tooltip>}
                  >
                    <div className="contact-button" style={{ display: "flex", alignSelf: "center" }}>
                      <button
                        type="button"
                        className="contact-icon"
                        style={{ ...contactIconStyle, color: darkModeStatus ? "white" : "inherit", background: `radial-gradient(50% 50% at 50% 50%, ${goalColor}33 20% 79.17%, ${goalColor} 100%)` }}
                      >
                        {inv.contactName[0]}
                      </button>
                    </div>
                  </OverlayTrigger>
                </div>
                { showChoice === inv.id && (
                <div style={{ display: "flex", justifyContent: "space-around", marginTop: "12px" }}>
                  <button
                    style={{
                      ...choiceBtnStyle }}
                    type="button"
                    onClick={() => { handleChoice("Ignore", index, inv.goal); }}
                  > Ignore
                  </button>
                  <button
                    style={{ background: darkModeStatus ? "#705BBC" : "#CD6E51",
                      color: darkModeStatus ? "white" : "E4E4E4",
                      ...choiceBtnStyle }}
                    type="button"
                    onClick={() => { handleChoice("Add", index, inv.goal); }}
                  > Add
                  </button>
                </div>
                )}
              </button>
            );
          })}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default GoalInvites;
