import { addGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { colorPalleteList } from "@src/utils";
import { v4 as uuidv4 } from "uuid";

const starterGoals = [];

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
const otherGoalIds = Array.from({ length: 10 }, () => uuidv4());

starterGoals.push(
  {
    title: "Sleep 😴🌙",
    goalTags: {
      afterTime: 22,
      id: otherGoalIds[0],
      beforeTime: 7,
      timeBudget: {
        perDay: "6-8",
        perWeek: "42-52",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
    },
  },
  {
    title: "Hobby project 🚂🚋",
    goalTags: {
      id: otherGoalIds[1],
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: "0-4",
        perWeek: "1-4",
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  },
  {
    title: "House chores 🏡🧹🛠️",
    goalTags: {
      id: otherGoalIds[2],
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: "1-3",
        perWeek: "2-3",
      },
      on: ["Sat", "Sun"],
    },
  },
  {
    title: "Family time 🥰",
    goalTags: {
      id: otherGoalIds[3],
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
    id: otherGoalIds[4],
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
      sublist: [otherGoalIds[5], otherGoalIds[6], otherGoalIds[7], otherGoalIds[8], otherGoalIds[9]],
    },
  },
  {
    title: "Walk 🚶🏽",
    goalTags: {
      id: otherGoalIds[5],
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
      id: otherGoalIds[6],
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
      id: otherGoalIds[7],
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
      id: otherGoalIds[8],
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
      id: otherGoalIds[9],
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
);

export { starterGoals };
