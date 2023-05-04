import React from "react";
import { languagesFullForms } from "@src/translations/i18n";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

import { colorPalleteList } from "@src/utils";
import ColorPalette from "@src/common/ColorPalette";
import { darkModeState, lastAction } from "@src/store";
import { selectedColorIndex } from "@src/store/GoalsState";
import { newGroupTitle } from "@src/store/GroupsState";

const AddGroup = () => {
  const lang = localStorage.getItem("language")?.slice(1, -1);
  const groupLang = lang ? languagesFullForms[lang] : languagesFullForms.en;

  const darkModeStatus = useRecoilValue(darkModeState);
  const [newGroupName, setNewGroupName] = useRecoilState(newGroupTitle);
  const [colorIndex, setColorIndex] = useRecoilState(selectedColorIndex);

  const setLastAction = useSetRecoilState(lastAction);

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLastAction("addGroup");
  };

  return (
    <form style={{ marginBottom: "1em" }} id="addGoalForm" className="todo-form" onSubmit={handleSubmit}>
      <input
        autoComplete="off"
        className={darkModeStatus ? "addtask-dark" : "addtask-light"}
        type="text"
        name="inputGroup"
        placeholder="Write Name of your new Group"
        value={newGroupName}
        id="goalInputField"
        style={{ borderColor: colorPalleteList[colorIndex] }}
        onChange={(e) => setNewGroupName(e.target.value)}
      />
      <div className="tags" style={{ position: "relative" }}>
        <button
          type="button"
          style={{
            backgroundColor: colorPalleteList[colorIndex],
            
          }}
          className="language"
        >
          {groupLang}
        </button>
        <ColorPalette colorIndex={colorIndex} setColorIndex={setColorIndex} />
      </div>
    </form>
  );
};

export default AddGroup;
