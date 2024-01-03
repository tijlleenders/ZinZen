import { addGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { colorPalleteList } from "@src/utils";
import { v4 as uuidv4 } from "uuid";

export const addStarterGoal = async (
  goalTitle: string,
  goalTags: {
    id?: string | null;
    afterTime: number | null;
    beforeTime: number | null;
    sublist?: string[];
    parentGoalId?: string;
  },
  colorIndex: number,
) => {
  await addGoal(
    createGoalObjectFromTags({
      title: goalTitle,
      ...goalTags,
      goalColor: colorPalleteList[colorIndex % colorPalleteList.length],
    }),
  );
};

const dailyHabitsId = uuidv4();

export const starterGoals = [
  {
    title: "Sleep 😴🌙",
    goalTags: {
      afterTime: 22,
      beforeTime: 7,
      timeBudget: {
        perDay: "6-8",
        perWeek: "42-52",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    title: "Hobby project 🚂🚋",
    goalTags: {
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: "1-4",
        perWeek: "1-4",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    title: "House chores 🏡🧹🛠️",
    goalTags: {
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: "1-3",
        perWeek: "1-3",
      },
      on: ["Sat", "Sun"],
    },
  },
  {
    title: "Family time 🥰",
    goalTags: {
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: "1-6",
        perWeek: "10-10",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    title: "Work 💪🏽",
    goalTags: {
      afterTime: 6,
      beforeTime: 18,
      timeBudget: {
        perDay: "6-10",
        perWeek: "40-40",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    },
  },
  {
    title: "Daily habits 🔁",
    goalTags: {
      id: dailyHabitsId,
      afterTime: null,
      beforeTime: null,
      timeBudget: {
        perDay: null,
        perWeek: null,
      },
      on: [],
      sublist: ["breakfast", "lunch", "dinner", "meTime", "walk"],
    },
  },
  {
    title: "Walk 🚶🏽",
    goalTags: {
      afterTime: 6,
      beforeTime: 21,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
    },
  },
  {
    title: "Me time 🧘🏽😌",
    goalTags: {
      afterTime: 5,
      beforeTime: 23,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
    },
  },
  {
    title: "Dinner 🍽️",
    goalTags: {
      afterTime: 18,
      beforeTime: 20,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
    },
  },
  {
    title: "Lunch 🥪",
    goalTags: {
      afterTime: 12,
      beforeTime: 14,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
    },
  },
  {
    title: "Breakfast 🥐🥣",
    goalTags: {
      afterTime: 6,
      beforeTime: 9,
      timeBudget: {
        perDay: "1-1",
        perWeek: "7-7",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
    },
  },
];
