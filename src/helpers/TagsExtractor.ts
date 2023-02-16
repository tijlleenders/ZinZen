import { ITagIndices, ITags } from "@src/Interfaces/ITagExtractor";
import { goalLinkHandler } from "./GoalLinkHandler";
import { goalRepeatHandler } from "./GoalRepeatHandler";
import { goalTimingHandler } from "./GoalTimingHandler";
import { goalDurationHandler } from "./GoalDurationHandler";

export function TagsExtractor(inputGoal: string) {
  const magicIndices : ITagIndices[] = [];

  const tempData : ITags = {
    start: null,
    due: null,
    afterTime: null,
    beforeTime: null,
    link: null,
    duration: null,
    repeats: null
  };

  function handleTiming() {
    const handlerOutput = goalTimingHandler(inputGoal);

    tempData.start = handlerOutput.start;
    tempData.due = handlerOutput.end;
    tempData.afterTime = handlerOutput.afterTime;
    tempData.beforeTime = handlerOutput.beforeTime;

    if (handlerOutput.start) { magicIndices.push({ word: "start", index: handlerOutput.start.index }); }
    if (handlerOutput.end) { magicIndices.push({ word: "due", index: handlerOutput.end.index }); }
    if (handlerOutput.afterTime) { magicIndices.push({ word: "afterTime", index: handlerOutput.afterTime.index }); }
    if (handlerOutput.beforeTime) { magicIndices.push({ word: "beforeTime", index: handlerOutput.beforeTime.index }); }

    return magicIndices;
  }
  function handleGoalLink() {
    const handlerOutput = goalLinkHandler(inputGoal);
    tempData.link = handlerOutput.value;
    if (handlerOutput.value) { magicIndices.push({ word: "link", index: handlerOutput.value.index }); }
    return handlerOutput.value ? [{ word: "link", index: handlerOutput.value.index }] : [];
  }
  function handleGoalDuration() {
    let handlerOutput = goalDurationHandler(inputGoal);
    let begin = -1;
    if (handlerOutput.value) {
      begin = handlerOutput.value.index;
    }
    if (tempData.repeats) {
      if (begin > tempData.repeats.index && begin <= tempData.repeats.endIndex) {
        handlerOutput = { status: false, value: null };
      }
    }
    tempData.duration = handlerOutput.value;
    if (handlerOutput.value) { magicIndices.push({ word: "duration", index: handlerOutput.value.index }); }
    return handlerOutput.value ? [{ word: "duration", index: handlerOutput.value.index }] : [];
  }
  function handleGoalRepeat() {
    const handlerOutput = goalRepeatHandler(inputGoal);
    tempData.repeats = handlerOutput.value;
    if (handlerOutput.value) { magicIndices.push({ word: "repeats", index: handlerOutput.value.index }); }
    return handlerOutput.value ? [{ word: "repeats", index: handlerOutput.value.index }] : [];
  }

  handleTiming();
  handleGoalLink();
  handleGoalRepeat();
  handleGoalDuration();

  magicIndices.sort((a, b) => a.index - b.index);

  return { tags: tempData, occurences: magicIndices };
}
