import { IParticipant } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import { themeState } from "@src/store/ThemeState";
import { Modal } from "antd";
import React from "react";
import { useRecoilValue } from "recoil";

const Participants = ({ list }: { list: IParticipant[] }) => {
  const theme = useRecoilValue(themeState);
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <Modal
      className={`configModal popupModal${darkModeStatus ? "-dark" : ""} 
        ${darkModeStatus ? "dark" : "light"}-theme${theme[darkModeStatus ? "dark" : "light"]}`}
      open
      width={360}
      closable={false}
      footer={null}
      onCancel={() => {
        window.history.back();
      }}
    >
      <div style={{ textAlign: "left", padding: 20, fontSize: 16, fontWeight: 600 }} className="header-title">
        Participants
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
            style={{ display: "flex", justifyContent: "space-between" }}
            key={`${participant.relId}-${participant.name}`}
          >
            <p style={{ fontSize: 16 }}>{participant.name}</p>
            <button className="default-btn" style={{ padding: 8, margin: 0 }} type="button">
              {participant.following ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Participants;
