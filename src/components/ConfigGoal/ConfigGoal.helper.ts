import { ISchedulerOutput } from "@src/Interfaces/IScheduler";
import { GoalItem, TGoalCategory } from "@src/models/GoalItem";
import { getRandomColor, getSelectedLanguage } from "@src/utils";

export interface FormState {
  goalColor: string;
  title: string;
  hintOption: boolean;
  simpleGoal:
    | {
        due: string;
        duration: string | undefined;
      }
    | undefined;
  budgetGoal:
    | {
        on: string[];
        afterTime: number;
        beforeTime: number;
        perDayHrs: {
          min: number;
          max: number;
        };
        perWeekHrs: {
          min: number;
          max: number;
        };
      }
    | undefined;
}

export const roundOffHours = (hrsValue: string) => {
  return hrsValue === "" ? "" : String(Math.min(Math.max(Math.round(Number(hrsValue)), 0), 99));
};

// do not change the order
export const calDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function convertOnFilterToArray(on: "weekdays" | "weekends") {
  return on === "weekdays" ? ["Mon", "Tue", "Wed", "Thu", "Fri"] : ["Sat", "Sun"];
}

export const getDefaultColor = (
  isEditMode: boolean,
  goal: GoalItem,
  parentGoal: GoalItem | undefined,
  colorPalleteList: string[],
): string => {
  if (isEditMode) {
    return goal.goalColor;
  }

  if (parentGoal) {
    return parentGoal.goalColor;
  }

  return getRandomColor(colorPalleteList);
};

export const getDefaultFormStateForSimpleGoal = (goal: GoalItem): FormState["simpleGoal"] => {
  return {
    due: goal.due ? new Date(goal.due).toISOString().slice(0, 10) : "",
    duration: goal.duration ?? "",
  };
};

export const getDefaultFormStateForBudgetGoal = (goal: GoalItem, isEditMode: boolean): FormState["budgetGoal"] => {
  const defaultAfterTime = isEditMode ? (goal.afterTime ?? 9) : 9;
  const defaultBeforeTime = isEditMode ? (goal.beforeTime ?? 18) : 18;

  const timeDiff = defaultBeforeTime - defaultAfterTime;

  const perDayBudget = {
    min: goal.timeBudget?.perDay?.min ?? timeDiff,
    max: goal.timeBudget?.perDay?.max ?? timeDiff,
  };

  const perWeekBudget = {
    min: goal.timeBudget?.perWeek?.min ?? timeDiff * (goal.on?.length ?? 5),
    max: goal.timeBudget?.perWeek?.max ?? timeDiff * (goal.on?.length ?? 5),
  };

  return {
    on: goal.on || convertOnFilterToArray("weekdays"),
    afterTime: defaultAfterTime,
    beforeTime: defaultBeforeTime,
    perDayHrs: perDayBudget,
    perWeekHrs: perWeekBudget,
  };
};

interface GetFinalTagsParams {
  goal: GoalItem;
  formState: FormState;
  parentGoal?: GoalItem;
  type: TGoalCategory;
}

export const getFinalTags = ({ goal, formState, type, parentGoal }: GetFinalTagsParams): GoalItem => {
  const goalCategoryType = formState.simpleGoal?.duration !== "" ? "Standard" : "Cluster";
  const category = type === "Budget" ? "Budget" : goalCategoryType;

  return {
    ...goal,
    title: formState.title
      .split(" ")
      .filter((ele: string) => ele !== "")
      .join(" "),
    goalColor: formState.goalColor,
    parentGoalId: parentGoal?.id ?? goal.parentGoalId,
    language: getSelectedLanguage(),
    ...(formState.simpleGoal
      ? {
          due:
            formState.simpleGoal.due && formState.simpleGoal.due !== ""
              ? new Date(formState.simpleGoal.due).toISOString()
              : undefined,
          duration: formState.simpleGoal.duration,
          category,
        }
      : {
          category,
          afterTime: formState.budgetGoal?.afterTime ?? undefined,
          beforeTime: formState.budgetGoal?.beforeTime ?? undefined,
          on: formState.budgetGoal?.on ? calDays.filter((ele) => formState.budgetGoal?.on.includes(ele)) : undefined,
          timeBudget: {
            perDay: {
              min: formState.budgetGoal?.perDayHrs.min ?? 0,
              max: formState.budgetGoal?.perDayHrs.max ?? 0,
            },
            perWeek: {
              min: formState.budgetGoal?.perWeekHrs.min ?? 0,
              max: formState.budgetGoal?.perWeekHrs.max ?? 0,
            },
          },
        }),
  };
};

export const checkSchedulingStatus = async (schedulerOutput: ISchedulerOutput | undefined, goalId: string) => {
  if (!schedulerOutput) return "pending";

  const { scheduled, impossible } = schedulerOutput;

  if (impossible?.some((task) => task.id === goalId)) {
    return "impossible";
  }

  const isScheduledInNext7Days = scheduled.some((day) => day.tasks.some((task) => task.goalid === goalId));

  return isScheduledInNext7Days ? "scheduled" : "future";
};

export const sliderTooltipAlignConfig = {
  points: ["bc", "tc"],
  offset: [0, -40],
  overflow: { adjustX: true, adjustY: true },
  useCssTransform: true,
};
