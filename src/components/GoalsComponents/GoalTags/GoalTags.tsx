import React, {  } from 'react'
import { useRecoilValue } from 'recoil';

import { darkModeState } from '@src/store';
import { colorPallete } from '@src/utils';
import { ITagIndices, ITags } from '@src/Interfaces/ITagExtractor';

interface IGoalTagsProps {
  selectedColorIndex: number,
  goalLang: string,
  formInputData: string,
  setFormInputData: React.Dispatch<React.SetStateAction<string>>,
  goalTags: ITags,
  setGoalTags: React.Dispatch<React.SetStateAction<ITags>>,
  magicIndices: ITagIndices[],


}
const GoalTags: React.FC<IGoalTagsProps> = ({ 
  selectedColorIndex,
  goalLang, 
  goalTags,
  setGoalTags,
  magicIndices,
  formInputData,
  setFormInputData,
}) => {
    const darkModeStatus = useRecoilValue(darkModeState);

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
    
  return (
     <div className="tags">
      <button
      type="button"
      style={
          darkModeStatus
          ? { backgroundColor: colorPallete[selectedColorIndex] }
          : { backgroundColor: colorPallete[selectedColorIndex] }
      }
      className="language"
      >
      {goalLang}
      </button>

      <button
      type="button"
      style={
          darkModeStatus
          ? { backgroundColor: colorPallete[selectedColorIndex] }
          : { backgroundColor: colorPallete[selectedColorIndex] }
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
          ? { backgroundColor: colorPallete[selectedColorIndex] }
          : { backgroundColor: colorPallete[selectedColorIndex] }
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
          ? { backgroundColor: colorPallete[selectedColorIndex] }
          : { backgroundColor: colorPallete[selectedColorIndex] }
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
          ? { backgroundColor: colorPallete[selectedColorIndex] }
          : { backgroundColor: colorPallete[selectedColorIndex] }
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
          ? { backgroundColor: colorPallete[selectedColorIndex] }
          : { backgroundColor: colorPallete[selectedColorIndex] }
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
          ? { backgroundColor: colorPallete[selectedColorIndex] }
          : { backgroundColor: colorPallete[selectedColorIndex] }
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
          ? { backgroundColor: colorPallete[selectedColorIndex] }
          : { backgroundColor: colorPallete[selectedColorIndex] }
      }
      className={goalTags?.link?.value ? "form-tag" : "blank"}
      onClick={() => { handleTagClick("link"); }}
      >
      URL
      </button>
     </div>
  )
}

export default GoalTags