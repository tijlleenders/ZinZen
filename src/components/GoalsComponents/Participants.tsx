import React, { useEffect, useState } from "react";
import { followContactOnGoal, getGoal } from "@src/api/GoalsAPI";
import { IParticipant } from "@src/models/GoalItem";
import { Switch } from "antd";
import CrossIcon from "@assets/images/deleteIcon.svg";
import TickIcon from "@assets/images/correct.svg";
import ZModal from "@src/common/ZModal";

const Participants = ({ goalId }: { goalId: string }) => {
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
    <ZModal type="configModal" open onCancel={() => window.history.back()}>
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
                checkedChildren={<img src={TickIcon} alt="Tick icon" />}
                unCheckedChildren={<img src={CrossIcon} alt="Cross icon" />}
              />
            </div>
          </div>
        ))}
      </div>
    </ZModal>
  );
};

export default Participants;
