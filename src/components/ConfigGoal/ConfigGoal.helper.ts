import { ISchedulerOutput } from "@src/Interfaces/IScheduler";
import { GoalItem } from "@src/models/GoalItem";
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

  // const perDayBudget = (goal.timeBudget?.perDay?.includes("-") ? goal.timeBudget.perDay : `${timeDiff}-${timeDiff}`)
  //   .split("-")
  //   .map((ele) => Number(ele));

  const perDayBudget = {
    min: goal.timeBudget?.perDay?.min ?? timeDiff,
    max: goal.timeBudget?.perDay?.max ?? timeDiff,
  };

  // const perWeekBudget = (
  //   goal.timeBudget?.perWeek?.includes("-")
  //     ? goal.timeBudget.perWeek
  //     : `${timeDiff * (goal.on?.length ?? 7)}-${timeDiff * (goal.on?.length ?? 7)}`
  // )
  //   .split("-")
  //   .map((ele) => Number(ele));

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
  parentGoal: GoalItem | undefined;
}

export const getFinalTags = ({ goal, formState, parentGoal }: GetFinalTagsParams): GoalItem => ({
  ...goal,
  title: formState.title
    .split(" ")
    .filter((ele: string) => ele !== "")
    .join(" "),
  goalColor: formState.goalColor,
  parentGoalId: parentGoal?.id ?? "root",
  language: getSelectedLanguage(),
  ...(formState.simpleGoal
    ? {
        due:
          formState.simpleGoal.due && formState.simpleGoal.due !== ""
            ? new Date(formState.simpleGoal.due).toISOString()
            : null,
        duration: formState.simpleGoal.duration,
        category: "Standard",
      }
    : {
        category: "Budget",
        afterTime: formState.budgetGoal?.afterTime ?? null,
        beforeTime: formState.budgetGoal?.beforeTime ?? null,
        on: formState.budgetGoal?.on ? calDays.filter((ele) => formState.budgetGoal?.on.includes(ele)) : null,
        timeBudget: {
          perDay: formState.budgetGoal?.perDayHrs.join("-") ?? "",
          perWeek: formState.budgetGoal?.perWeekHrs.join("-") ?? "",
        },
      }),
});

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
