import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

import { darkModeState, displayPartnerMode } from "@src/store";
import { goalsHistory } from "@src/store/GoalsState";
import { ILocationState, ImpossibleGoal } from "@src/Interfaces";

import { useParentGoalContext } from "@src/contexts/parentGoal-context";
import GoalAvatar from "../GoalAvatar";
import GoalTitle from "./components/GoalTitle";
import GoalDropdown from "./components/GoalDropdown";
import { extractLinks } from "@src/utils/patterns";

interface MyGoalProps {
  goal: ImpossibleGoal;
  dragAttributes?: any;
  dragListeners?: any;
}

const MyGoal: React.FC<MyGoalProps> = ({ goal, dragAttributes, dragListeners }) => {
  const [expandGoalId, setExpandGoalId] = useState("root");
  const [isAnimating, setIsAnimating] = useState(true);
  const { title } = goal;
  const titleContainsVideoLink = title.includes("youtube") || title.includes("peertube");

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
  const showPartnerMode = useRecoilValue(displayPartnerMode);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const redirect = (state: object, isDropdown = false) => {
    if (isDropdown) {
      navigate(`/MyGoals/${parentGoal?.id || "root"}/${goal.id}?showOptions=true`, { state });
    } else {
      navigate(`/MyGoals/${goal.id}`, { state });
    }
  };

  const handleGoalClick = () => {
    const link = extractLinks(goal.title);
    if (link) {
      let url = link;
      if (!url.startsWith("http://") && !url.startsWith("https://")) {
        url = "https://" + url;
      }
      window.open(url, "_blank");
      return;
    }
    const newState: ILocationState = {
      ...location.state,
      activeGoalId: goal.id,
      goalsHistory: [
        ...subGoalHistory,
        {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || "",
        },
      ],
    };

    redirect(newState);
  };

  async function handleDropDown(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    e.stopPropagation();
    const navState: ILocationState = { ...location.state, from: "" };
    if (goal.newUpdates) {
      navState.displayChanges = goal;
    } else {
      // navState.displayGoalActions = { actionType, goal };
    }
    redirect(navState, true);
  }

  useEffect(() => {
    if (location && location.pathname === "/MyGoals") {
      const { expandedGoalId } = location.state || {};
      setExpandGoalId(expandedGoalId);
    }
  }, [location]);

  return (
    <div
      key={String(`goal-${goal.id}`)}
      className={`user-goal${darkModeStatus ? "-dark" : ""} ${
        expandGoalId === goal.id && isAnimating ? "goal-glow" : ""
      }`}
    >
      <div
        className="user-goal-main"
        style={{
          ...(goal.typeOfGoal !== "myGoal" && goal.parentGoalId === "root" ? { width: "80%" } : {}),
        }}
      >
        <div onClickCapture={handleDropDown} {...dragAttributes} {...dragListeners}>
          <GoalDropdown goal={goal} titleContainsVideoLink={titleContainsVideoLink} />
        </div>
        <div
          aria-hidden
          style={titleContainsVideoLink ? { marginLeft: "-5px" } : {}}
          className="goal-tile"
          onClick={handleGoalClick}
        >
          <GoalTitle goal={goal} isImpossible={goal.impossible} />
        </div>
      </div>
      {!showPartnerMode && goal.participants?.length > 0 && <GoalAvatar goal={goal} />}
    </div>
  );
};

export default MyGoal;
