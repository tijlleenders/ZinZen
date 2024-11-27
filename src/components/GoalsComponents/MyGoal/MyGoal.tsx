/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
import React, { ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";
import { ILocationState, ImpossibleGoal } from "@src/Interfaces";
import { useParentGoalContext } from "@src/contexts/parentGoal-context";
import { extractLinks, isGoalCode } from "@src/utils/patterns";
import useGoalActions from "@src/hooks/useGoalActions";
import GoalAvatar from "../GoalAvatar";
import GoalTitle from "./components/GoalTitle";
import { GoalContainer } from "../ZItemContainer";
import GoalIcon from "./components/GoalIcon";
import NotificationSymbol from "@src/common/NotificationSymbol";
import CopyIcon from "@src/assets/CopyIcon";
import TriangleIcon from "@src/assets/TriangleIcon";

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
  const { partnerId } = useParams();
  const isPartnerModeActive = !!partnerId;

  const [expandGoalId, setExpandGoalId] = useState("root");
  const [isAnimating, setIsAnimating] = useState(true);
  const { copyCode } = useGoalActions();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAnimating(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const {
    parentData: { parentGoal },
  } = useParentGoalContext();
  const darkModeStatus = useRecoilValue(darkModeState);

  const redirect = (state: object, isDropdown = false) => {
    const prefix = `${isPartnerModeActive ? `/partners/${partnerId}/` : "/"}goals`;
    if (isDropdown) {
      const searchparam = goal.newUpdates ? "showNewChanges" : "showOptions";
      navigate(`${prefix}/${parentGoal?.id || "root"}/${goal.id}?${searchparam}=true`, { state });
    } else {
      navigate(`${prefix}/${goal.id}`, { state });
    }
  };

  const handleGoalClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();

    const url = extractLinks(goal.title);
    if (url && !isGoalCode(goal.title)) {
      const finalUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(finalUrl, "_blank");
      return;
    }
    if (isGoalCode(goal.title)) {
      copyCode(goal.title);
      return;
    }
    const newState: ILocationState = {
      ...location.state,
      activeGoalId: goal.id,
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
    if (location && location.pathname === "/goals") {
      const { expandedGoalId } = location.state || {};
      setExpandGoalId(expandedGoalId);
    }
  }, [location]);

  const innerBorderColor = goal.sublist.length > 0 ? goal.goalColor : "transparent";

  const titleContainsVideoLink =
    goal.title.includes("youtube") || goal.title.includes("peertube") || goal.title.includes("youtu");
  const titleIsCode = isGoalCode(goal.title);

  return (
    <GoalContainer id={`goal-${goal.id}`} expandGoalId={expandGoalId} isAnimating={isAnimating}>
      <div
        style={{ touchAction: "none" }}
        onClickCapture={(e) => {
          e.stopPropagation();
          redirect(location.state, true);
        }}
        {...dragAttributes}
        {...dragListeners}
      >
        <GoalIcon color={goal.goalColor} showDottedBorder={!(goal.timeBudget?.perDay == null)}>
          {titleIsCode ? (
            <CopyIcon color={goal.goalColor} size={37} borderWidth={4} borderColor={innerBorderColor} />
          ) : titleContainsVideoLink ? (
            <TriangleIcon color={goal.goalColor} size={37} borderWidth={4} borderColor={goal.goalColor} />
          ) : (
            <InnerCircle color={innerBorderColor}>
              {goal.newUpdates && <NotificationSymbol color={goal.goalColor} />}
            </InnerCircle>
          )}
        </GoalIcon>
      </div>
      <div aria-hidden className="goal-tile" onClick={(e) => handleGoalClick(e)}>
        <GoalTitle goal={goal} isImpossible={goal.impossible} />
      </div>
      {!isPartnerModeActive && goal.participants?.length > 0 && <GoalAvatar goal={goal} />}
    </GoalContainer>
  );
};

export default React.memo(MyGoal);
