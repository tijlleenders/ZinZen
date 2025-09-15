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
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { glowGoalIdState } from "@src/store/GlowGoalIdState";
import GoalAvatar from "../GoalAvatar";
import GoalTitle from "./components/GoalTitle";
import { GoalIcon } from "./components/GoalIcon";
import { ZItemContainer } from "../ZItemContainer";
import { selectedParentId } from "@pages/GoalsPage/SublistGoalAtom";
import { useGetActiveGoals } from "@src/hooks/api/Goals/queries/useGetActiveGoals";
import { getActiveGoals } from "@src/api/GoalsAPI";
import { useQueryClient } from "react-query";
import { GOAL_QUERY_KEYS } from "@src/factories/queryKeyFactory";

// eslint-disable-next-line no-shadow
export enum ActionModal {
  ACTIVE = "active",
  DELETED = "deleted",
  ARCHIVED = "archived",
}

interface MyGoalProps {
  goal: ImpossibleGoal;
  dragAttributes?: any;
  dragListeners?: any;
  actionModal?: ActionModal;
}

const InnerCircle: React.FC<{ color: string; children: ReactNode }> = ({ color, children }) => {
  return (
    <div className="goal-dd-inner" style={{ borderColor: color }}>
      {children}
    </div>
  );
};

const MyGoal: React.FC<MyGoalProps> = ({ goal, dragAttributes, dragListeners, actionModal = ActionModal.ACTIVE }) => {
  const { parentId = "root", partnerId } = useParams();
  const isPartnerModeActive = !!partnerId;
  const { copyCode } = useGoalActions();
  const goalToMove = useRecoilValue(moveGoalState);
  const [glowGoalId, setGlowGoalId] = useRecoilState(glowGoalIdState);
  const queryClient = useQueryClient();

  const navigate = useNavigate();
  const location = useLocation();

  const redirect = async (state: object, isDropdown = false, actionModalType = ActionModal.ACTIVE) => {
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;
    if (isDropdown) {
      const searchparam = goal.newUpdates ? "showNewChanges" : "showOptions";
      navigate(`${prefix}/${parentId}/${goal.id}?${searchparam}=true`, { state: { ...state, actionModalType } });
    } else {
      const queryKey = GOAL_QUERY_KEYS.list("active", goal.id);
      const cachedData = queryClient.getQueryData(queryKey);

      if (!cachedData) {
        const subgoals = await getActiveGoals(goal.id);
        queryClient.setQueryData(queryKey, subgoals);
      }

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
          redirect(location.state, true, actionModal);
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
