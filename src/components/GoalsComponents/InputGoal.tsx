import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";

import { darkModeState } from "@src/store";
import ITagExtractor, { ITagIndices } from "@src/Interfaces/ITagExtractor";
import { TagsExtractor } from "@src/helpers/TagsExtractor";
import { extractedTitle, inputGoalTags } from "@src/store/GoalsState";
import { formatTagsToText } from "@src/helpers/GoalConvertor";
import { createGoalObjectFromTags } from "@src/api/GoalsAPI";

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
  const [, setMagicIndices] = useState<ITagIndices[]>([]);
  const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
  const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);

  const handleTagClick = (tagType: string) => {
    const updatedTags = { ...goalTags };
    delete updatedTags[tagType]
    setGoalTags({ ...updatedTags });
    const res = formatTagsToText(
      createGoalObjectFromTags({
        title: goalTitle,
        repeat: updatedTags.repeats ? updatedTags?.repeats.value.trim() : null,
        duration: updatedTags.duration ? updatedTags.duration.value : null,
        start: updatedTags.start ? updatedTags.start.value : null,
        due: updatedTags.due ? updatedTags.due.value : null,
        afterTime: updatedTags.afterTime ? updatedTags.afterTime.value : null,
        beforeTime: updatedTags.beforeTime ? updatedTags.beforeTime.value : null,
        link: updatedTags.link ? `${updatedTags.link.value}`.trim() : null,
      })
    );
    setFormInputData(res.inputText);
  };

  useEffect(() => {
    const output: ITagExtractor = TagsExtractor(formInputData);
    if (output.occurences.length > 0) setGoalTitle(formInputData.slice(0, output.occurences[0].index));
    else setGoalTitle(formInputData.trim());
    setGoalTags(output.tags);
    setMagicIndices(output.occurences);
  }, [formInputData]);

  useEffect(() => {
    (document.getElementById("goalInputField") as HTMLInputElement).setSelectionRange(0, 0);
    (document.getElementById("goalInputField") as HTMLInputElement).focus();
  }, []);
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
          {`Start ${goalTags?.start?.value.toLocaleDateString()}${goalTags?.afterTime?.value ? "" : `, ${goalTags?.start?.value?.toTimeString().slice(0, 5)}`}`}
        </button>

        <button
          type="button"
          style={
          darkModeStatus
            ? { backgroundColor: selectedColor }
            : { backgroundColor: selectedColor }
        }
          className={goalTags?.afterTime?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("afterTime"); }}
        >
          {`After ${goalTags?.afterTime?.value}:00`}
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
          {`Due ${goalTags?.due?.value.toLocaleDateString()}${goalTags?.beforeTime?.value ? "" : `, ${goalTags?.due?.value?.toTimeString().slice(0, 5)}`}`}
        </button>

        <button
          type="button"
          style={
          darkModeStatus
            ? { backgroundColor: selectedColor }
            : { backgroundColor: selectedColor }
        }
          className={goalTags?.beforeTime?.value ? "form-tag" : "blank"}
          onClick={() => { handleTagClick("beforeTime"); }}
        >
          {`Before ${goalTags?.beforeTime?.value}:00`}
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
