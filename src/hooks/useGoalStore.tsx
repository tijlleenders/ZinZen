import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ILocationState } from "@src/Interfaces";
import { getGoal } from "@src/api/GoalsAPI";
import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import { displayConfirmation } from "@src/store";
import { displayGoalId, goalsHistory, selectedColorIndex } from "@src/store/GoalsState";
import { colorPalleteList } from "@src/utils";

const useGoalStore = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { parentId } = useParams();
  const selectedGoalId = useRecoilValue(displayGoalId);
  const subGoalHistory = useRecoilValue(goalsHistory);
  const showConfirmation = useRecoilValue(displayConfirmation);

  const setColorIndex = useSetRecoilState(selectedColorIndex);

  const handleAddGoal = async (type: TGoalCategory, goal: GoalItem | null = null) => {
    let newLocationState: ILocationState = { ...location.state, displayAddGoal: selectedGoalId };
    delete newLocationState.displayAddGoalOptions;
    if (selectedGoalId === "root") {
      setColorIndex(Math.floor(Math.random() * colorPalleteList.length));
    } else if (goal) {
      setColorIndex(colorPalleteList.indexOf(goal.goalColor));
    } else {
      await getGoal(selectedGoalId).then((fetchedGoal) => {
        if (fetchedGoal) setColorIndex(colorPalleteList.indexOf(fetchedGoal.goalColor));
      });
    }
    if (goal) {
      newLocationState = {
        goalsHistory: [
          ...subGoalHistory,
          {
            goalID: goal.id || "root",
            goalColor: goal.goalColor || "#ffffff",
            goalTitle: goal.title || "",
          },
        ],
        activeGoalId: goal.id,
      };
    }
    newLocationState.displayAddGoal = goal ? goal.id : selectedGoalId;
    navigate(`/MyGoals/${parentId || "root"}?type=${type}&mode=add`, {
      state: {
        ...newLocationState,
        goalType: type,
      },
      replace: true,
    });
  };

  const handleUpdateGoal = (goal: GoalItem) => {
    const newLocationState: ILocationState = { ...location.state };
    delete newLocationState.displayGoalActions;
    navigate(`/MyGoals/${goal.parentGoalId}/${goal.id}?type=${goal.category}&mode=edit`, {
      state: {
        ...newLocationState,
        displayUpdateGoal: goal.id,
        goalType: goal.category === "Budget" ? "Budget" : "Goal",
      },
      replace: true,
    });
  };

  const handleShareGoal = (goal: GoalItem) => {
    navigate("/MyGoals", { state: { ...location.state, displayShareModal: goal } });
  };

  const handleConfirmation = () => {
    navigate("/MyGoals", { state: { ...location.state, displayConfirmation: { ...showConfirmation, open: true } } });
  };

  const handleDisplayChanges = () => {
    navigate("/MyGoals", { state: location.state });
  };
  const handleGoalActions = (id: string) => {
    navigate("/MyGoals", { state: { ...location.state, showGoalActions: id } });
  };

  return {
    handleAddGoal,
    handleShareGoal,
    handleUpdateGoal,
    handleGoalActions,
    handleConfirmation,
    handleDisplayChanges,
  };
};

export default useGoalStore;
