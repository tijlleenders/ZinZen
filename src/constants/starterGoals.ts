import { addGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { colorPalleteList } from "@src/utils";

export const addStarterGoal = async (
  goalTitle: string,
  goalTags: {
    habit: string | null,
    duration: string | null,
    start: string | null,
    due: string | null,
    afterTime: number | null,
    beforeTime: number | null,
  },
  colorIndex: number
) => {
  await addGoal(createGoalObjectFromTags({
    title: goalTitle,
    ...goalTags,
    goalColor: colorPalleteList[colorIndex],
  }));
};
export const starterGoals = [
  {
    title: "Sleep 😴🌙",
    goalTags: {
      start: null,
      due: null,
      afterTime: 0,
      beforeTime: 6,
      link: null,
      duration: "6",
      habit: "daily",
    }
  },
  {
    title: "Breakfast 🥐🥣",
    goalTags: {
      start: null,
      due: null,
      afterTime: 6,
      beforeTime: 9,
      link: null,
      duration: "1",
      habit: "daily",
    }
  },
  {
    title: "Lunch 🥪",
    goalTags: {
      start: null,
      due: null,
      afterTime: 12,
      beforeTime: 14,
      link: null,
      duration: "1",
      habit: "daily",
    }
  },
  {
    title: "Dinner 🍽️",
    goalTags: {
      start: null,
      due: null,
      afterTime: 18,
      beforeTime: 21,
      link: null,
      duration: "1",
      habit: "daily",
    }
  },
  {
    title: "Walk 🚶🏽",
    goalTags: {
      start: null,
      due: null,
      afterTime: 14,
      beforeTime: 20,
      link: null,
      duration: "1",
      habit: "daily",
    }
  },
  {
    title: "Me time 🧘🏽😌",
    goalTags: {
      start: null,
      due: null,
      afterTime: 7,
      beforeTime: 21,
      link: null,
      duration: "1",
      habit: "daily",
    }
  },
];
