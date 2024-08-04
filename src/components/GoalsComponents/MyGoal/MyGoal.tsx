import React, { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import { darkModeState, displayPartnerMode, lastAction } from "@src/store";
import { ILocationState, ImpossibleGoal } from "@src/Interfaces";
import { extractLinks } from "@src/utils/patterns";
import { useParentGoalContext } from "@src/contexts/parentGoal-context";
import { getGoalById } from "@src/api/GoalsAPI";
import GoalAvatar from "../GoalAvatar";
import GoalTitle from "./components/GoalTitle";
import GoalDropdown from "./components/GoalDropdown";

interface MyGoalProps {
  goal: ImpossibleGoal;
  dragAttributes?: any;
  dragListeners?: any;
}

const MyGoal: React.FC<MyGoalProps> = ({ goal, dragAttributes, dragListeners }) => {
  const [expandGoalId, setExpandGoalId] = useState("root");
  const [isAnimating, setIsAnimating] = useState(true);
  const goalRef = useRef<HTMLDivElement>(null);

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
  const [action, setLastAction] = useRecoilState(lastAction);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setLastAction("none");
    getGoalById(goal.id).then((doc) => {
      setIsCompleted(doc?.archived === "true");
    });
  }, [action]);

  const redirect = (state: object, isDropdown = false) => {
    if (isDropdown) {
      navigate(`/goals/${parentGoal?.id || "root"}/${goal.id}?showOptions=true`, { state });
    } else {
      navigate(`/goals/${goal.id}`, { state });
    }
  };

  const handleGoalClick = () => {
    if (isCompleted) return;

    const url = extractLinks(goal.title);
    if (url) {
      const finalUrl = url.startsWith("http://") || url.startsWith("https://") ? url : `https://${url}`;
      window.open(finalUrl, "_blank");
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

  const handleDropDown = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const navState: ILocationState = { ...location.state, from: "" };
    if (goal.newUpdates) {
      navState.displayChanges = goal;
    }
    redirect(navState, true);
  };

  useEffect(() => {
    if (location && location.pathname === "/goals") {
      const { expandedGoalId } = location.state || {};
      setExpandGoalId(expandedGoalId);
    }
  }, [location]);

  return (
    <div
      ref={goalRef}
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
        <div style={{ touchAction: "none" }} onClickCapture={handleDropDown} {...dragAttributes} {...dragListeners}>
          <GoalDropdown goal={goal} />
        </div>
        <div aria-hidden className="goal-tile" onClick={handleGoalClick}>
          <GoalTitle goal={goal} isImpossible={goal.impossible} isCompleted={isCompleted} />
        </div>
      </div>
      {!showPartnerMode && goal.participants?.length > 0 && <GoalAvatar goal={goal} />}
    </div>
  );
};

export default MyGoal;
