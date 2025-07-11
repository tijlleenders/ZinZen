/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactNode, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ILocationState, ImpossibleGoal } from "@src/Interfaces";
import { isGoalCode } from "@src/utils/patterns";
import NotificationSymbol from "@src/common/NotificationSymbol";
import useGoalActions from "@src/hooks/useGoalActions";
import TriangleIcon from "@src/assets/TriangleIcon";
import { CopyIcon } from "@src/assets/CopyIcon";
import { moveGoalState } from "@src/store/moveGoalState";
import { useRecoilState, useRecoilValue } from "recoil";
import { glowGoalIdState } from "@src/store/GlowGoalIdState";
import GoalAvatar from "../GoalAvatar";
import GoalTitle from "./components/GoalTitle";
import { GoalIcon } from "./components/GoalIcon";
import { ZItemContainer } from "../ZItemContainer";

interface MyGoalProps {
  goal: ImpossibleGoal;
  dragAttributes?: any;
  dragListeners?: any;
}

const InnerCircle: React.FC<{ color: string; children: ReactNode }> = ({ color, children }) => {
  return (
    <div className="goal-dd-inner" style={{ borderColor: color }}>
      {children}
    </div>
  );
};

const MyGoal: React.FC<MyGoalProps> = ({ goal, dragAttributes, dragListeners }) => {
  const { parentId = "root", partnerId } = useParams();
  const isPartnerModeActive = !!partnerId;
  const { copyCode } = useGoalActions();
  const goalToMove = useRecoilValue(moveGoalState);
  const [glowGoalId, setGlowGoalId] = useRecoilState(glowGoalIdState);

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = (state: object, isDropdown = false) => {
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;
    if (isDropdown) {
      const searchparam = goal.newUpdates ? "showNewChanges" : "showOptions";
      navigate(`${prefix}/${parentId}/${goal.id}?${searchparam}=true`, { state });
    } else {
      navigate(`${prefix}/${goal.id}`, { state });
    }
  };

  const handleGoalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    if (isGoalCode(goal.title)) {
      copyCode(goal.title);
      return;
    }

    const newState: ILocationState = {
      ...location.state,
      goalsHistory: [
        ...(location.state?.goalsHistory || []),
        {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "",
        },
      ],
    };
    redirect(newState);
  };

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

  const titleContainsVideoLink =
    goal.title.includes("youtube") || goal.title.includes("peertube") || goal.title.includes("youtu");
  const titleIsCode = isGoalCode(goal.title);

  return (
    <ZItemContainer
      id={`goal-${goal.id}`}
      shouldAnimate={glowGoalId === goal.id}
      dataTestId={`goal-${goal.title}`}
      isGoalToBeMoved={goalToMove?.id === goal.id}
    >
      <div
        style={{ touchAction: "none" }}
        onClickCapture={(e) => {
          e.stopPropagation();
          redirect(location.state, true);
        }}
        {...dragAttributes}
        {...dragListeners}
      >
        {titleIsCode ? (
          <CopyIcon color={goal.goalColor} size={37} borderWidth={4} borderColor={innerBorderColor} />
        ) : titleContainsVideoLink ? (
          <TriangleIcon color={goal.goalColor} size={37} borderWidth={4} borderColor={goal.goalColor} />
        ) : (
          <GoalIcon color={goal.goalColor} showDottedBorder={!(goal.timeBudget?.perDay == null)}>
            <InnerCircle color={innerBorderColor}>
              {goal.newUpdates && (
                <NotificationSymbol color={goal.goalColor} dataTestId={`notification-dot-${goal.title}`} />
              )}
            </InnerCircle>
          </GoalIcon>
        )}
      </div>
      <div className="goal-tile" onClick={handleGoalClick} role="presentation">
        <GoalTitle goal={goal} isImpossible={goal.impossible} onTitleClick={handleGoalClick} />
      </div>
      {!isPartnerModeActive && goal.participants?.length > 0 && <GoalAvatar goal={goal} />}
    </ZItemContainer>
  );
};

export default React.memo(MyGoal);
