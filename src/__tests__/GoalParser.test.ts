// @ts-nocheck
import { goalDurationHandler } from "@src/helpers/GoalDurationHandler";
import { goalLinkHandler } from "@src/helpers/GoalLinkHandler";
import { goalRepeatHandler } from "@src/helpers/GoalRepeatHandler";
import { goalTimingHandler } from "@src/helpers/GoalTimingHandler";

const testCases = [
  {
    input: "workout paper start 12/3 daily 1h",
    duration: { status: true, value: { index: 31, value: 1 } },
    repeats: { status: true, value: { index: 24, value: "Daily", endIndex: 29 } },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 13 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper 2h weekly start tomorrow",
    duration: { status: true, value: { index: 14, value: 2 } },
    repeats: { status: true, value: { index: 16, value: "Weekly", endIndex: 22 } },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 23 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper start tomorrow @15",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 13 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper start tuesday",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 13 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper 3hr monthly start next week www.google.com",
    duration: { status: true, value: { index: 14, value: 3 } },
    repeats: { status: true, value: { index: 17, value: "Monthly", endIndex: 24 } },
    link: { status: true, value: { index: 42, value: "www.google.com" } },
    timing: {
      status: false,
      start: { index: 25 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper start next week thursday",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 13 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper start tuesday @15",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 13 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper start next week @15",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 13 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper start next week Tuesday @15",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 13 },
      end: null,
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by 12/3",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by tomorrow",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by tomorrow @15",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by tuesday",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by next week",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by next week thursday",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by tuesday @15",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by next week @15",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "workout paper by next week Tuesday @15",
    duration: { status: false, value: null },
    repeats: { status: false, value: null },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 13 },
      afterTime: null,
      beforeTime: null,
    },
  },
  {
    input: "watch dailymotion show 1h weekly start tomorrow after 12 daily",
    duration: { status: true, value: { index: 23, value: 1 } },
    repeats: { status: true, value: { index: 25, value: "Weekly", endIndex: 31 } },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 32 },
      end: null,
      afterTime: { index: 47, value: 12 },
      beforeTime: null,
    },
  },
  {
    input:
      "watch dailymotion show 1h weekly start tomorrow after 12 by next week weekly",
    duration: { status: true, value: { index: 23, value: 1 } },
    repeats: { status: true, value: { index: 25, value: "Weekly", endIndex: 31 } },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: { index: 32 },
      end: { index: 56 },
      afterTime: { index: 47, value: 12 },
      beforeTime: null,
    },
  },
  {
    input: "watch dailymotion show 1h weekly after 17 by next week weekly",
    duration: { status: true, value: { index: 23, value: 1 } },
    repeats: { status: true, value: { index: 25, value: "Weekly", endIndex: 31 } },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: { index: 41 },
      afterTime: { index: 32, value: 17 },
      beforeTime: null,
    },
  },
  {
    input: "watch dailymotion show 1h weekly after 12 before 18 weekly",
    duration: { status: true, value: { index: 23, value: 1 } },
    repeats: { status: true, value: { index: 25, value: "Weekly", endIndex: 31 } },
    link: { status: false, value: null },
    timing: {
      status: false,
      start: null,
      end: null,
      afterTime: { index: 32, value: 12 },
      beforeTime: { index: 41, value: 18 },
    },
  },
  {
    input: "read 1h daily start 12/4 after 12 due 14/4 www.google.com",
    duration: { status: true, value: { index: 5, value: 1 } },
    repeats: { status: true, value: { index: 7, value: "Daily", endIndex: 12 } },
    link: { status: true, value: { index: 43, value: "www.google.com" } },
    timing: {
      status: false,
      start: { index: 13 },
      end: { index: 33 },
      afterTime: { index: 24, value: 12 },
      beforeTime: null,
    },
  },
];

describe("Goal Parser Test cases", () => {
  testCases.map((tc, index) =>
    it(`Test Case ${index}`, () => {
      const timing = goalTimingHandler(tc.input);
      if (timing && timing.start && timing.start.value) { delete timing.start.value; }
      if (timing && timing.end && timing.end.value) { delete timing.end.value; }
      expect(goalDurationHandler(tc.input)).toEqual(tc.duration);
      expect(goalRepeatHandler(tc.input)).toEqual(tc.repeats);
      expect(goalLinkHandler(tc.input)).toEqual(tc.link);
      expect(timing).toEqual(tc.timing);
    })
  );
});
