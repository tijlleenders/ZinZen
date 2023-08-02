import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ILocationState } from "@src/Interfaces";
import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem } from "@src/models/GoalItem";
import { displayConfirmation } from "@src/store";
import { displayGoalId, goalsHistory, selectedColorIndex } from "@src/store/GoalsState";
import { colorPalleteList } from "@src/utils";

function useGoalStore() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);

  const setColorIndex = useSetRecoilState(selectedColorIndex);

  const handleAddGoal = async (goal: GoalItem | null = null) => {
    let newLocationState: ILocationState = { displayAddGoal: selectedGoalId };
    if (selectedGoalId === "root") {
      setColorIndex(Math.floor((Math.random() * colorPalleteList.length) + 1));
    } else if (goal) {
      setColorIndex(colorPalleteList.indexOf(goal.goalColor));
    } else {
      await getGoal(selectedGoalId).then((fetchedGoal) => { if (fetchedGoal) setColorIndex(colorPalleteList.indexOf(fetchedGoal.goalColor)); });
    }
    if (goal) {
      newLocationState = {
        goalsHistory: [...subGoalHistory, {
          goalID: goal.id || "root",
          goalColor: goal.goalColor || "#ffffff",
          goalTitle: goal.title || ""
        },
        ],
        activeGoalId: goal.id
      };
    }
    newLocationState.displayAddGoal = goal ? goal.id : selectedGoalId;
    navigate("/MyGoals", {
      state: {
        ...location.state,
        ...(goal ? {
          goalsHistory: [...subGoalHistory, {
            goalID: goal.id || "root",
            goalColor: goal.goalColor || "#ffffff",
            goalTitle: goal.title || ""
          },
          ],
          activeGoalId: goal.id
        }
          : {}),
        displayAddGoal: goal ? goal.id : selectedGoalId
      }
    });
  };

  const handleUpdateGoal = (id: string) => {
    navigate("/MyGoals", { state: { ...location.state, displayUpdateGoal: id } });
  };

  const handleShareGoal = (id: string) => {
    navigate("/MyGoals", { state: { ...location.state, displayShareModal: id } });
  };

  const handleConfirmation = () => {
    navigate("/MyGoals", { state: { ...location.state, displayConfirmation: { ...showConfirmation, open: true } } });
  };

  const handleDisplayChanges = () => {
    navigate("/MyGoals", { state: location.state });
  };

  const handleOpenInbox = () => {
    navigate("/MyGoals", { state: { ...location.state, displayInbox: true } });
  };

  return {
    handleAddGoal,
    handleShareGoal,
    handleUpdateGoal,
    handleOpenInbox,
    handleConfirmation,
    handleDisplayChanges
  };
}

export default useGoalStore;
