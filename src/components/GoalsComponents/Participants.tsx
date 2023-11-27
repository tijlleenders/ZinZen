import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { followContactOnGoal, getGoal } from "@src/api/GoalsAPI";
import { IParticipant } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import { themeState } from "@src/store/ThemeState";
import { Modal } from "antd";
import ToggleFollowSwitch from "./ToggleFollowSwitch";

const Participants = ({ goalId }: { goalId: string }) => {
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);

  const [list, setList] = useState<IParticipant[]>([]);

  const getParticipants = async () => {
    const goal = await getGoal(goalId);
    if (goal) {
      setList([...goal.participants]);
    }
  };

  const handleFollow = async (following: boolean, participant: IParticipant) => {
    await followContactOnGoal(goalId, { ...participant, following });
    getParticipants();
  };

  useEffect(() => {
    getParticipants();
  }, []);

  const toggleFollowStatus = async (participant: IParticipant, value: boolean) => {
    await handleFollow(value, participant);
  };

  return (
    <Modal
      className={`configModal popupModal${darkModeStatus ? "-dark" : ""} ${darkModeStatus ? "dark" : "light"}-theme${
        theme[darkModeStatus ? "dark" : "light"]
      }`}
      open
      width={360}
      closable={false}
      footer={null}
      onCancel={() => {
        window.history.back();
      }}
    >
      <div style={{ textAlign: "left", padding: 20, fontSize: 16, fontWeight: 600 }} className="header-title">
        Following
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 20,
          marginTop: 24,
          padding: "0 20px",
        }}
      >
        {list.map((participant) => (
          <div
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            key={`${participant.relId}-${participant.name}`}
          >
            <p style={{ fontSize: 16 }}>{participant.name}</p>
            <div style={{ display: "flex", alignItems: "center" }}>
              <ToggleFollowSwitch onChange={(value) => toggleFollowStatus(participant, value)} />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Participants;
