import { addGoal, createGoalObjectFromTags } from "@src/api/GoalsAPI";

export const addStarterGoal = async (
  goalTitle: string,
  goalTags: {
    repeats: { index: number; value: string; endIndex: number } | null;
    duration: { value: number | null | undefined };
    start: { value: Date | null | undefined };
    due: { value: Date | null | undefined };
    afterTime: { value: number | null | undefined };
    beforeTime: { value: number | null | undefined };
    link: { value: string };
  },
) => {
  await addGoal(createGoalObjectFromTags({
    title: goalTitle,
    repeat: goalTags.repeats ? goalTags?.repeats.value.trim() : null,
    duration: goalTags.duration ? goalTags.duration.value : null,
    start: goalTags.start ? goalTags.start.value : null,
    due: goalTags.due ? goalTags.due.value : null,
    afterTime: goalTags.afterTime ? goalTags.afterTime.value : null,
    beforeTime: goalTags.beforeTime ? goalTags.beforeTime.value : null,
    link: goalTags.link ? `${goalTags.link.value}`.trim() : null,
  }));
};
export const starterGoals = [
  {
    title: "Sleep",
    goalTags: {
      start: null,
      due: null,
      afterTime: { index: 11, value: 22 },
      beforeTime: { index: 11, value: 8 },
      link: null,
      duration: { index: 17, value: 8 },
      repeats: { index: 5, endIndex: 10, value: "Daily" },
    }
  },
  {
    title: "Breakfast",
    goalTags: {
      start: null,
      due: null,
      afterTime: { index: 15, value: 6 },
      beforeTime: { index: 15, value: 9 },
      link: null,
      duration: { index: 20, value: 1 },
      repeats: { index: 9, endIndex: 14, value: "Daily" },
    }
  },
  {
    title: "Lunch",
    goalTags: {
      start: null,
      due: null,
      afterTime: { index: 11, value: 12 },
      beforeTime: { index: 11, value: 14 },
      link: null,
      duration: { index: 18, value: 1 },
      repeats: { index: 5, endIndex: 10, value: "Daily" },
    }
  },
  {
    title: "Dinner",
    goalTags: {
      start: null,
      due: null,
      afterTime: { index: 12, value: 18 },
      beforeTime: { index: 12, value: 21 },
      link: null,
      duration: { index: 19, value: 1 },
      repeats: { index: 6, endIndex: 11, value: "Daily" },
    }
  },
  {
    title: "Walk",
    goalTags: {
      start: null,
      due: null,
      afterTime: { index: 13, value: 14 },
      beforeTime: { index: 13, value: 20 },
      link: null,
      duration: { index: 11, value: 1 },
      repeats: { index: 4, endIndex: 9, value: "Daily" },
    }
  },
  {
    title: "Water the plants indoors",
    goalTags: {
      start: null,
      due: null,
      afterTime: null,
      beforeTime: null,
      link: null,
      duration: { index: 25, value: 1 },
      repeats: { index: 27, endIndex: 39, value: "Every 3 days" },
    }
  },
  {
    title: "Me time",
    goalTags: {
      start: null,
      due: null,
      afterTime: null,
      beforeTime: null,
      link: null,
      duration: { index: 8, value: 1 },
      repeats: { index: 10, endIndex: 15, value: "Daily" },
    }
  },
];
