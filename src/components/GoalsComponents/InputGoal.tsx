import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useTranslation } from "react-i18next";

import { darkModeState } from "@src/store";
import ITagExtractor, { ITagIndices } from "@src/Interfaces/ITagExtractor";
import { TagsExtractor } from "@src/helpers/TagsExtractor";
import { extractedTitle, inputGoalTags } from "@src/store/GoalsState";

interface IGoalTagsProps {
  goalInput: string,
  selectedColor: string,
  goalLang: string
}
const InputGoal: React.FC<IGoalTagsProps> = ({
  goalInput,
  selectedColor,
  goalLang,
}) => {
  const { t } = useTranslation();

  const darkModeStatus = useRecoilValue(darkModeState);
  const [formInputData, setFormInputData] = useState(goalInput);
  const [magicIndices, setMagicIndices] = useState<ITagIndices[]>([]);
  const setGoalTitle = useSetRecoilState(extractedTitle);
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);

  const handleTagClick = (tagType: string) => {
    if (goalTags) {
      const tmpTags = { ...goalTags };
      let tmpString = formInputData;
      const index = magicIndices.findIndex((ele) => ele.word === tagType);

      let nextIndex = index + 1;
      while (nextIndex < magicIndices.length && magicIndices[nextIndex].index === magicIndices[index].index) { nextIndex += 1; }

      if (index + 1 === magicIndices.length) {
        tmpString = tmpString.slice(0, magicIndices[index]?.index);
      } else {
        tmpString = `${tmpString.slice(0, magicIndices[index]?.index).trim()} ${tmpString.slice(magicIndices[nextIndex].index).trim()}`;
      }
      if (tagType === "duration" && goalTags.duration) {
        tmpTags.duration = null;
      } else if (tagType === "repeats" && goalTags.repeats) {
        tmpTags.repeats = null;
      } else if (tagType === "link" && goalTags.link) {
        tmpTags.link = null;
      } else if (tagType === "start" && goalTags.start) {
        tmpTags.start = null;
      } else if (tagType === "due" && goalTags.due) {
        tmpTags.due = null;
      } else if (tagType === "startTime" && goalTags.startTime) {
        tmpTags.startTime = null;
      } else if (tagType === "endTime" && goalTags.endTime) {
        tmpTags.endTime = null;
      }
      setGoalTags({ ...tmpTags });
      setFormInputData(tmpString.trim());
    }
  };

  useEffect(() => {
    const output: ITagExtractor = TagsExtractor(formInputData);
    if (output.occurences.length > 0) setGoalTitle(formInputData.slice(0, output.occurences[0].index));
    else setGoalTitle(formInputData.trim());
    setGoalTags(output.tags);
    setMagicIndices(output.occurences);
  }, [formInputData]);
  return (
    <>
      <div>
        <input
          autoComplete="off"
          className={darkModeStatus ? "addtask-dark" : "addtask-light"}
          type="text"
          name="inputGoal"
          placeholder={t("addGoalPlaceholder")}
          value={formInputData}
          id="goalInputField"
          style={{ borderColor: selectedColor }}
          // eslint-disable-next-line jsx-a11y/no-autofocus
          autoFocus
          onChange={(e) => setFormInputData(e.target.value)}
        />
      </div>
      <div className="tags">
        <button
          type="button"
          style={
        darkModeStatus
          ? { backgroundColor: selectedColor }
          : { backgroundColor: selectedColor }
      }
          className="language"
        >
          {goalLang}
        </button>

        <button
          type="button"
          style={
          darkModeStatus
            ? { backgroundColor: selectedColor }
            : { backgroundColor: selectedColor }
      }
          className={goalTags?.start?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("start"); }}
        >
          {`Start ${goalTags?.start?.value.toLocaleDateString()}${goalTags?.startTime?.value ? "" : `, ${goalTags?.start?.value?.toTimeString().slice(0, 5)}`}`}
        </button>

        <button
          type="button"
          style={
          darkModeStatus
            ? { backgroundColor: selectedColor }
            : { backgroundColor: selectedColor }
        }
          className={goalTags?.startTime?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("startTime"); }}
        >
          {`After ${goalTags?.startTime?.value}:00`}
        </button>

        <button
          type="button"
          style={
          darkModeStatus
            ? { backgroundColor: selectedColor }
            : { backgroundColor: selectedColor }
        }
          className={goalTags?.due?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("due"); }}
        >
          {`Due ${goalTags?.due?.value.toLocaleDateString()}${goalTags?.endTime?.value ? "" : `, ${goalTags?.due?.value?.toTimeString().slice(0, 5)}`}`}
        </button>

        <button
          type="button"
          style={
          darkModeStatus
            ? { backgroundColor: selectedColor }
            : { backgroundColor: selectedColor }
        }
          className={goalTags?.endTime?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("endTime"); }}
        >
          {`Before ${goalTags?.endTime?.value}:00`}
        </button>

        <button
          type="button"
          style={
        darkModeStatus
          ? { backgroundColor: selectedColor }
          : { backgroundColor: selectedColor }
      }
          className={goalTags?.duration?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("duration"); }}
        >
          {`${goalTags?.duration?.value} hours`}
        </button>

        <button
          type="button"
          style={
          darkModeStatus
            ? { backgroundColor: selectedColor }
            : { backgroundColor: selectedColor }
        }
          className={goalTags?.repeats?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("repeats"); }}
        >
          {goalTags?.repeats?.value}
        </button>

        <button
          type="button"
          style={
          darkModeStatus
            ? { backgroundColor: selectedColor }
            : { backgroundColor: selectedColor }
        }
          className={goalTags?.link?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("link"); }}
        >
          URL
        </button>
      </div>
    </>
  );
};

export default InputGoal;
