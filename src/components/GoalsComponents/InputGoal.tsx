import React, { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil';

import { darkModeState } from '@src/store';
import ITagExtractor, { ITagIndices, ITags } from '@src/Interfaces/ITagExtractor';
import { useTranslation } from 'react-i18next';
import { TagsExtractor } from '@src/helpers/TagsExtractor';

interface IGoalTagsProps {
  goalInput: string,
  selectedColor: string,
  goalLang: string,
  goalTags: ITags,
  setGoalTitle: React.Dispatch<React.SetStateAction<string>>,
  setGoalTags: React.Dispatch<React.SetStateAction<ITags>>,
}
const GoalTags: React.FC<IGoalTagsProps> = ({ 
  goalInput,
  selectedColor,
  goalLang, 
  goalTags,
  setGoalTags,
  setGoalTitle
}) => {
    const darkModeStatus = useRecoilValue(darkModeState);
    const [formInputData, setFormInputData] = useState(goalInput);
    const [magicIndices, setMagicIndices] = useState<ITagIndices[]>([]);

    const { t } = useTranslation();

    const handleTagClick = (tagType: string) => {
      if(goalTags) {
        console.log(magicIndices)
        let tmpString = formInputData;
        const index = magicIndices.findIndex((ele) => ele.word === tagType);
        
        let nextIndex = index + 1;
        while (nextIndex < magicIndices.length && magicIndices[nextIndex].index === magicIndices[index].index) { nextIndex += 1; }
        
        if (index + 1 === magicIndices.length) {
          tmpString = tmpString.slice(0, magicIndices[index]?.index);
        } else {
          tmpString = `${tmpString.slice(0, magicIndices[index]?.index).trim()} ${tmpString.slice(magicIndices[nextIndex].index).trim()}`;
        }
        if (tagType === "duration" && goalTags.duration)  {
          goalTags.duration = null;
        } else if (tagType === "repeats" && goalTags.repeats) {
          goalTags.repeats = null;
        } else if (tagType === "link" && goalTags.link) {
          goalTags.link = null;
        } else if (tagType === "start" && goalTags.start) {
          goalTags.start = null;
        } else if (tagType === "due" && goalTags.due) {
          goalTags.due = null;
        } else if (tagType === "startTime" && goalTags.startTime) {
          goalTags.startTime = null;
        } else if (tagType === "endTime" && goalTags.endTime) {
          goalTags.endTime = null;
        }
        setGoalTags(goalTags)
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
  )
}

export default GoalTags