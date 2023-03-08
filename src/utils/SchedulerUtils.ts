/* eslint-disable camelcase */
// @ts-nocheck

import { I24Slots, IMSInputGoal, schedulerSlot } from "@src/Interfaces/ISchedulerInputGoal";
import { v4 as uuidv4 } from "uuid";

export const get24Slots = () => [...Array(24).keys()].map(() => ({ bookedBy: "root", booked: false }));

export const convertDateToDay = (date: Date) => `${date.toLocaleDateString("en-us", { weekday: "long" })}`;

export const sortTheGoals = (inputGoals: IMSInputGoal[]) => {
  inputGoals.sort((a, b) => {
    const aStart = a.after_time ? a.after_time : 0;
    const aBefore = a.before_time ? a.before_time : 24;
    const bStart = b.after_time ? b.after_time : 0;
    const bBefore = b.before_time ? b.before_time : 24;
    return (aBefore - aStart) - (bBefore - bStart);
  });
  return inputGoals;
};

export const getNecessaryParams = (goal: IMSInputGoal) => {
  const { duration } = goal;
  const front = goal.after_time ? goal.after_time : 0;
  let back = 24;
  let nextDayIncluded = false;
  if (goal.before_time) {
    if (goal.after_time) {
      if (goal.after_time <= goal.before_time) {
        back = goal.before_time;
      } else { nextDayIncluded = true; }
    } else { back = goal.before_time; }
  }
  let actualDuration = Number(duration);
  if (nextDayIncluded && goal.after_time) {
    actualDuration = (24 - goal.after_time) < duration ? 24 - goal.after_time : duration;
  }
  return { actualDuration, back, front };
};

export const BookSlots = (goal: IMSInputGoal, globalSlots: I24Slots[], front: number, back: number, actualDuration: number, debug = false) => {
  let remainingHr = actualDuration;
  const assignedSlots: schedulerSlot[] = [];
  const { id, title, repeat } = goal;
  const slots = [...globalSlots];
  for (let i = front; i < back && (repeat.toLowerCase() === "weekly" ? true : remainingHr <= (back - front)); i += 1) {
    if (!slots[i].booked) {
      remainingHr -= 1;
      slots[i] = { booked: true, bookedBy: id };
      if (assignedSlots.length > 0) {
        const lastSlot = assignedSlots[assignedSlots.length - 1];
        if (lastSlot.deadline === i) {
          assignedSlots[assignedSlots.length - 1] = {
            ...lastSlot,
            start: lastSlot.start,
            deadline: lastSlot.deadline === 23 ? 0 : lastSlot.deadline + 1,
            duration: lastSlot.duration === 23 ? 0 : lastSlot.duration + 1 };
        } else {
          assignedSlots.push({ start: i, deadline: i + 1 === 24 ? 0 : i + 1, duration: 1, goalid: id, title });
        }
      } else assignedSlots.push({ start: i, deadline: i + 1 === 24 ? 0 : i + 1, duration: 1, goalid: id, title });
    }
    if (remainingHr === 0) { break; }
  }
  return { remainingHr, newGlobalslots: slots, assignedSlots };
};

export const getHrInDate = (date: Date, goal) => {
  const dummyStart = new Date(date);
  const str = dummyStart.toISOString().slice(0, 19);
  const obj = { startDateFormat: `${str.slice(0, 11)}${`${goal.start}`.length === 1 ? `0${goal.start}` : goal.start}:00:00`,
    deadlineFormat: `${str.slice(0, 11)}${`${goal.deadline}`.length === 1 ? `0${goal.deadline}` : goal.deadline}:00:00` };
  return obj;
};

export const addFreeSlots = (slotsOfDay) => {
  let startHr = 0;
  slotsOfDay.sort((a, b) => {
    const AStartHr = Number(a.start.slice(11, 13));
    const BStartHr = Number(b.start.slice(11, 13));
    return AStartHr - BStartHr;
  });
  const all24Slots = [...slotsOfDay];
  slotsOfDay.forEach((ele) => {
    const slotStartHr = Number(ele.start.slice(11, 13));
    if (slotStartHr !== startHr) {
      all24Slots.push({
        title: "free",
        goalid: uuidv4(),
        duration: Math.abs(slotStartHr - startHr),
        start: `${ele.start.slice(0, 11)}${startHr <= 9 ? "0" : ""}${startHr}:00:00`,
        deadline: ele.start });
      startHr = Number(ele.deadline.slice(11, 13));
    } else {
      startHr = Number(ele.deadline.slice(11, 13));
    }
  });
  all24Slots.sort((a, b) => {
    const AStartHr = Number(a.start.slice(11, 13));
    const BStartHr = Number(b.start.slice(11, 13));
    return AStartHr - BStartHr;
  });
  return all24Slots;
};

export const getDurations = (goal) => {
  let duration;
  let diff = 0;
  let minDuration;
  let maxDuration;
  if (goal.duration.includes("-")) {
    [minDuration, maxDuration] = goal.duration.split("-").map((d) => Number(d.slice(-1) === "h" ? d.slice(0, -1) : d));
    duration = maxDuration;
    diff = maxDuration - minDuration;
  } else {
    duration = Number(goal.duration);
    minDuration = duration;
    maxDuration = duration;
  }
  return { goalDuration: duration, diff };
};
