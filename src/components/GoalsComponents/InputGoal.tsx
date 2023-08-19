// import { useTranslation } from "react-i18next";
// import React, { useEffect, useState } from "react";
// import { useRecoilState, useRecoilValue } from "recoil";

// import { getDateInText } from "@src/utils";
// import { darkModeState, openInbox } from "@src/store";
// import { TagsExtractor } from "@src/helpers/TagsExtractor";
// import { extractedTitle, inputGoalTags } from "@src/store/GoalsState";
// import ITagExtractor, { ITagIndices } from "@src/Interfaces/ITagExtractor";
// import { createGoalObjectFromTags, formatTagsToText } from "@src/helpers/GoalProcessor";

// interface IGoalTagsProps {
//   goalInput: string,
//   selectedColor: string,
//   goalLang: string
// }
// const InputGoal: React.FC<IGoalTagsProps> = ({
//   goalInput,
//   selectedColor,
//   goalLang,
// }) => {
//   const { t } = useTranslation();

//   const darkModeStatus = useRecoilValue(darkModeState);
//   const isInboxOpen = useRecoilValue(openInbox);
//   const [formInputData, setFormInputData] = useState(goalInput);
//   const [, setMagicIndices] = useState<ITagIndices[]>([]);
//   const [goalTitle, setGoalTitle] = useRecoilState(extractedTitle);
//   const [goalTags, setGoalTags] = useRecoilState(inputGoalTags);

//   const handleTagClick = (tagType: string) => {
//     const updatedTags = { ...goalTags };
//     delete updatedTags[tagType];
//     setGoalTags({ ...updatedTags });
//     const res = formatTagsToText(
//       createGoalObjectFromTags({
//         title: goalTitle,
//         repeat: updatedTags.repeats ? updatedTags?.repeats.value.trim() : null,
//         duration: updatedTags.duration ? updatedTags.duration.value : null,
//         start: updatedTags.start ? updatedTags.start.value : null,
//         due: updatedTags.due ? updatedTags.due.value : null,
//         afterTime: (updatedTags.afterTime || updatedTags.afterTime === 0) ? updatedTags.afterTime.value : null,
//         beforeTime: (updatedTags.beforeTime || updatedTags.beforeTime === 0) ? updatedTags.beforeTime.value : null,
//         link: updatedTags.link ? `${updatedTags.link.value}`.trim() : null,
//       })
//     );
//     setFormInputData(res.inputText);
//   };

//   const getTag = (tagName: string, content: string | null) => (
//     <button
//       type="button"
//       style={{ backgroundColor: selectedColor }}
//       className="form-tag"
//       onClick={() => { if (content && !isInboxOpen) { handleTagClick(tagName); } }}
//     >
//       {content}
//     </button>
//   );

//   useEffect(() => {
//     const output: ITagExtractor = TagsExtractor(formInputData);
//     if (output.occurences.length > 0) setGoalTitle(formInputData.slice(0, output.occurences[0].index));
//     else setGoalTitle(formInputData.trim());
//     setGoalTags(output.tags);
//     setMagicIndices(output.occurences);
//   }, [formInputData]);

//   useEffect(() => {
//     (document.getElementById("goalInputField") as HTMLInputElement).setSelectionRange(0, 0);
//     (document.getElementById("goalInputField") as HTMLInputElement).focus();
//   }, []);

//   return (
//     <>
//       <div>
//         <input
//           autoComplete="off"
//           className={darkModeStatus ? "addtask-dark" : "addtask-light"}
//           type="text"
//           name="inputGoal"
//           placeholder={t("addGoalPlaceholder")}
//           value={formInputData}
//           id="goalInputField"
//           style={{ borderColor: selectedColor }}
//           contentEditable={!isInboxOpen}
//           disabled={isInboxOpen}
//           // eslint-disable-next-line jsx-a11y/no-autofocus
//           onChange={(e) => setFormInputData(e.target.value)}
//         />
//       </div>
//       <div className="tags">
//         <button
//           type="button"
//           style={
//             darkModeStatus
//               ? { backgroundColor: selectedColor }
//               : { backgroundColor: selectedColor }
//           }
//           className="language"
//         >
//           {goalLang}
//         </button>

//         {goalTags?.start?.value &&
//           getTag("start", `Start ${getDateInText(goalTags.start.value)} ${goalTags?.afterTime?.value ? "" : `, ${goalTags?.start?.value?.toTimeString().slice(0, 5)}`}`)}

//         {(goalTags?.afterTime?.value || goalTags?.afterTime?.value === 0) &&
//           getTag("afterTime", `After ${goalTags.afterTime.value}:00`)}

//         {goalTags?.due?.value &&
//           getTag("due", `Due ${getDateInText(goalTags.due.value)}${goalTags?.beforeTime?.value ? "" : `, ${goalTags?.due?.value?.toTimeString().slice(0, 5)}`}`)}

//         {(goalTags?.beforeTime?.value || goalTags?.beforeTime?.value === 0) &&
//           getTag("beforeTime", `Before ${goalTags.beforeTime.value}:00`)}

//         {goalTags?.duration?.value &&
//           getTag("duration", `${goalTags.duration.value}h`)}

//         {goalTags?.repeats?.value &&
//           getTag("repeats", goalTags.repeats.value)}

//         {goalTags?.link?.value &&
//           getTag("link", "URL")}
//       </div>
//     </>
//   );
// };

// export default InputGoal;
