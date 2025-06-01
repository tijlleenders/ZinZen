import React from "react";
import { Switch } from "antd";
import CrossIcon from "@assets/images/deleteIcon.svg";
import TickIcon from "@assets/images/correct.svg";

import ZModal from "@src/common/ZModal";
import { IParticipant } from "@src/models/GoalItem";
import { followContactOnGoal } from "@src/api/GoalsAPI";
import { useParams } from "react-router-dom";
import { useGetGoalById } from "@src/hooks/api/Goals/queries/useGetGoalById";

const Participants = () => {
  const { activeGoalId } = useParams();
  const { data: goal } = useGetGoalById(activeGoalId || "");

  const toggleFollowStatus = async (participant: IParticipant, following: boolean) => {
    if (goal) await followContactOnGoal(goal.id, { ...participant, following });
  };

  return (
    <ZModal type="configGoal" open onCancel={() => window.history.back()}>
      <div style={{ textAlign: "left", padding: 20 }} className="header-title fw-600">
        Following
      </div>
      <div
        className="d-flex f-col gap-20"
        style={{
          marginTop: 24,
          padding: "0 20px",
        }}
      >
        {goal?.participants.map((participant) => (
          <div className="place-middle justify-sb" key={`${participant.relId}-${participant.name}`}>
            <p style={{ fontSize: 16 }}>{participant.name}</p>
            <div className="place-middle justify-fs">
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
