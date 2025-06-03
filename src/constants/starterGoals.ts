import { addGoal } from "@src/api/GoalsAPI";
import { createGoalObjectFromTags } from "@src/helpers/GoalProcessor";
import { TGoalCategory } from "@src/models/GoalItem";
import { colorPalleteList, getRandomColor } from "@src/utils";
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
    category: TGoalCategory;
  },
) => {
  await addGoal(
    createGoalObjectFromTags({
      title: goalTitle,
      ...goalTags,
      goalColor: getRandomColor(colorPalleteList),
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
        perDay: {
          min: 6,
          max: 8,
        },
        perWeek: {
          min: 42,
          max: 52,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
      category: "Budget",
    },
  },
  {
    title: "Hobby project 🚂🚋",
    goalTags: {
      id: otherGoalIds[1],
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: {
          min: 0,
          max: 4,
        },
        perWeek: {
          min: 1,
          max: 4,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      category: "Budget",
    },
  },
  {
    title: "House chores 🏡🧹🛠️",
    goalTags: {
      id: otherGoalIds[2],
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: {
          min: 1,
          max: 3,
        },
        perWeek: {
          min: 2,
          max: 3,
        },
      },
      on: ["Sat", "Sun"],
      category: "Budget",
    },
  },
  {
    title: "Family time 🥰",
    goalTags: {
      id: otherGoalIds[3],
      afterTime: 9,
      beforeTime: 24,
      timeBudget: {
        perDay: {
          min: 1,
          max: 6,
        },
        perWeek: {
          min: 10,
          max: 10,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      category: "Budget",
    },
  },
  {
    title: "Work 💪🏽",
    goalTags: {
      id: otherGoalIds[4],
      afterTime: 6,
      beforeTime: 18,
      timeBudget: {
        perDay: {
          min: 6,
          max: 10,
        },
        perWeek: {
          min: 40,
          max: 40,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      category: "Budget",
    },
  },
  {
    title: "Daily habits 🔁",
    goalTags: {
      id: dailyHabitsId,
      afterTime: null,
      beforeTime: null,
      sublist: [otherGoalIds[5], otherGoalIds[6], otherGoalIds[7], otherGoalIds[8], otherGoalIds[9]],
      category: "Cluster",
    },
  },
  {
    title: "Walk 🚶🏽",
    goalTags: {
      id: otherGoalIds[5],
      afterTime: 6,
      beforeTime: 21,
      timeBudget: {
        perDay: {
          min: 1,
          max: 1,
        },
        perWeek: {
          min: 7,
          max: 7,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
      category: "Budget",
    },
  },
  {
    title: "Me time 🧘🏽😌",
    goalTags: {
      id: otherGoalIds[6],
      afterTime: 5,
      beforeTime: 23,
      timeBudget: {
        perDay: {
          min: 1,
          max: 1,
        },
        perWeek: {
          min: 7,
          max: 7,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
      category: "Budget",
    },
  },
  {
    title: "Dinner 🍽️",
    goalTags: {
      id: otherGoalIds[7],
      afterTime: 18,
      beforeTime: 20,
      timeBudget: {
        perDay: {
          min: 1,
          max: 1,
        },
        perWeek: {
          min: 7,
          max: 7,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
      category: "Budget",
    },
  },
  {
    title: "Lunch 🥪",
    goalTags: {
      id: otherGoalIds[8],
      afterTime: 12,
      beforeTime: 14,
      timeBudget: {
        perDay: {
          min: 1,
          max: 1,
        },
        perWeek: {
          min: 7,
          max: 7,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
      category: "Budget",
    },
  },
  {
    title: "Breakfast 🥐🥣",
    goalTags: {
      id: otherGoalIds[9],
      afterTime: 6,
      beforeTime: 9,
      timeBudget: {
        perDay: {
          min: 1,
          max: 1,
        },
        perWeek: {
          min: 7,
          max: 7,
        },
      },
      on: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      parentGoalId: dailyHabitsId,
      category: "Budget",
    },
  },
);

export { starterGoals };
