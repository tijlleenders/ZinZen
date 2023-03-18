import { addGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { colorPalleteList } from "@src/utils";

export const addStarterGoal = async (
  goalTitle: string,
  goalTags: {
    habit: string | null, // { index: number; value: string; endIndex: number } | null;
    duration: string | null, // { value: number | null | undefined };
    start: string | null, // { value: Date | null | undefined };
    due: string | null, // { value: Date | null | undefined };
    afterTime: number | null, // { value: number | null | undefined };
    beforeTime: number | null, // { value: number | null | undefined };
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
      afterTime: 0, // { index: 11, value: 0 },
      beforeTime: 6, // { index: 11, value: 6 },
      link: null,
      duration: 6, // { index: 17, value: 6 },
      habit: "daily", // { index: 5, endIndex: 10, value: "daily" },
    }
  },
  {
    title: "Breakfast 🥐🥣",
    goalTags: {
      start: null,
      due: null,
      afterTime: 6, // { index: 15, value: 6 },
      beforeTime: 9, // { index: 15, value: 9 },
      link: null,
      duration: "1", // { index: 20, value: 1 },
      habit: "daily", // { index: 9, endIndex: 14, value: "daily" },
    }
  },
  {
    title: "Lunch 🥪",
    goalTags: {
      start: null,
      due: null,
      afterTime: 12, // { index: 11, value: 12 },
      beforeTime: 14, // { index: 11, value: 14 },
      link: null,
      duration: "1", // { index: 18, value: 1 },
      habit: "daily", // { index: 5, endIndex: 10, value: "daily" },
    }
  },
  {
    title: "Dinner 🍽️",
    goalTags: {
      start: null,
      due: null,
      afterTime: 18, // { index: 12, value: 18 },
      beforeTime: 21, // { index: 12, value: 21 },
      link: null,
      duration: "1", // { index: 19, value: 1 },
      habit: "daily", // { index: 6, endIndex: 11, value: "daily" },
    }
  },
  {
    title: "Walk 🚶🏽",
    goalTags: {
      start: null,
      due: null,
      afterTime: 14, // { index: 13, value: 14 },
      beforeTime: 20, // { index: 13, value: 20 },
      link: null,
      duration: "1", // { index: 11, value: 1 },
      habit: "daily", // { index: 4, endIndex: 9, value: "daily" },
    }
  },
  // {
  //   title: "Water the plants 🪴 indoors",
  //   goalTags: {
  //     start: null,
  //     due: null,
  //     afterTime: { index: 11, value: 7 },
  //     beforeTime: { index: 11, value: 21 },
  //     link: null,
  //     duration: { index: 25, value: 1 },
  //     repeats: { index: 27, endIndex: 39, value: "every 3 days" },
  //   }
  // },
  {
    title: "Me time 🧘🏽😌",
    goalTags: {
      start: null,
      due: null,
      afterTime: 7, // { index: 11, value: 7 },
      beforeTime: 21, // { index: 11, value: 21 },
      link: null,
      duration: "1", // { index: 8, value: 1 },
      habit: "daily", // { index: 10, endIndex: 15, value: "daily" },
    }
  },
];
