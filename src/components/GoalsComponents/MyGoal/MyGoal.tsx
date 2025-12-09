/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import { ImpossibleGoal } from "@src/Interfaces";
import { moveGoalState } from "@src/store/moveGoalState";
import { useRecoilState, useRecoilValue } from "recoil";
import { glowGoalIdState } from "@src/store/GlowGoalIdState";
import GoalAvatar from "../GoalAvatar";
import GoalTitle from "./components/GoalTitle";
import { GoalIconRenderer } from "./components/GoalIconRenderer";
import { ZItemContainer } from "../ZItemContainer";
import { ActionModal } from "./types";

interface MyGoalProps {
  goal: ImpossibleGoal;
  dragAttributes?: any;
  dragListeners?: any;
  actionModal?: ActionModal;
}

const MyGoal: React.FC<MyGoalProps> = ({ goal, dragAttributes, dragListeners, actionModal = ActionModal.ACTIVE }) => {
  const { partnerId } = useParams({ strict: false });
  const isPartnerModeActive = !!partnerId;
  const goalToMove = useRecoilValue(moveGoalState);
  const [glowGoalId, setGlowGoalId] = useRecoilState(glowGoalIdState);

  useEffect(() => {
    if (glowGoalId === goal.id) {
      const goalElement = document.getElementById(`goal-${goal.id}`);
      if (goalElement) {
        goalElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }

      setTimeout(() => {
        setGlowGoalId("");
      }, 500);
    }
  }, []);

  const innerBorderColor = goal.sublist.length > 0 ? goal.goalColor : "transparent";

  return (
    <ZItemContainer
      id={`goal-${goal.id}`}
      shouldAnimate={glowGoalId === goal.id}
      dataTestId={`goal-${goal.title}`}
      isGoalToBeMoved={goalToMove?.id === goal.id}
    >
      <GoalIconRenderer
        goal={goal}
        innerBorderColor={innerBorderColor}
        dragAttributes={dragAttributes}
        dragListeners={dragListeners}
        actionModal={actionModal}
      />
      <GoalTitle goal={goal} />
      {!isPartnerModeActive && goal.participants?.length > 0 && <GoalAvatar goal={goal} />}
    </ZItemContainer>
  );
};

export default React.memo(MyGoal);
