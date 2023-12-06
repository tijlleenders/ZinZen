import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { followContactOnGoal, getGoal } from "@src/api/GoalsAPI";
import { IParticipant } from "@src/models/GoalItem";
import { darkModeState } from "@src/store";
import { themeState } from "@src/store/ThemeState";
import { Modal, Switch } from "antd";
import CrossIcon from "@assets/images/deleteIcon.svg";
import TickIcon from "@assets/images/correct.svg";

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
      maskStyle={{
        backgroundColor: darkModeStatus ? "rgba(0, 0, 0, 0.50)" : "rgba(87, 87, 87, 0.4)",
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
              <Switch
                defaultChecked={participant.following}
                onChange={(value) => toggleFollowStatus(participant, value)}
                checkedChildren={
                  <img
                    src={TickIcon}
                    style={{ width: "15px", height: "15px", marginTop: "2px", filter: "brightness(0) invert(1)" }}
                    alt="Tick icon"
                  />
                }
                unCheckedChildren={
                  <img
                    src={CrossIcon}
                    style={{ width: "14px", height: "15px", marginTop: "2px", filter: "brightness(0) invert(1)" }}
                    alt="Cross icon"
                  />
                }
              />
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};

export default Participants;
