import { ITags } from "@src/Interfaces/ITagExtractor";

export const areGoalTagsValid = (goalTags: ITags) => {
  const { duration, repeats, start, due, afterTime, beforeTime } = goalTags;
  let valid = true;
  let reason = "none";
  let maxDurationPerDay = 24;
  if (duration) {
    const durationValue = Number(duration.value.includes("-") ? duration.value.split("-")[1] : duration.value);
    if (afterTime?.value) { maxDurationPerDay -= afterTime.value; }
    if (beforeTime?.value) { maxDurationPerDay -= 24 - beforeTime.value; }
    maxDurationPerDay = Math.abs(maxDurationPerDay);
    reason = `Impossible. Current max duration per day = ${maxDurationPerDay}h.`;
    if (repeats) {
      const repeatsValue = repeats.value.toLowerCase();
      if (repeatsValue === "daily" && durationValue > maxDurationPerDay) {
        valid = false;
      } else if (repeatsValue === "weekly" && durationValue > (maxDurationPerDay * 7)) {
        valid = false;
      } else if (repeatsValue === "monthly" && durationValue > (maxDurationPerDay * 30)) {
        valid = false;
      } else {
        reason = "none";
      }
    }
    if (valid && due?.value) {
      const daysLeft = (due.value.getTime() - (start?.value ? start.value : new Date()).getTime()) / (1000 * 60 * 60 * 24);
      console.log(daysLeft, maxDurationPerDay);
      if (durationValue > daysLeft * maxDurationPerDay) {
        valid = false;
        reason = `Impossible. Current max duration per day = ${maxDurationPerDay}h.`;
      }
    }
  }
  return { valid, reason };
};
