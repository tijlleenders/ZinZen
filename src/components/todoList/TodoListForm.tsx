import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import AddIconLight from '@assets/images/AddIconLight.png'
import AddIconDark from '@assets/images/AddIconDark.png';
import { darkModeState } from '@store';

import '@translations/i18n';
import './TodoList.scss';

export function TodoForm() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const darkcolors = ["#443027", " #9C4663", "#646464","#2B517B"," #612854"];
  const lightcolors = [" #EDC7B7", "#AC3B61", " #BAB2BC"," #3B6899"," #8E3379"];
  const { t } = useTranslation();
  const [selectedColorIndex, setColorIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [formInputData, setFormInputData] = useState(
    {
      inputGoal: '',
      id:0,
    },
  );

  const handleChange = (e:any) => {
    const { value } = e.target;
    const idNum = Date.now();

    setFormInputData({
      ...formInputData,
      id:idNum,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e:any) => {
    if (formInputData.inputGoal) {
      const newData = (data:any) => ([...data, formInputData]);
      setTableData(newData);
    }
    setFormInputData({
      inputGoal: '',
      id:0,
    });
    e.preventDefault();
  };

  const removeItem = () => {
    setTableData([]);
  };

  const changeColor = () => {
    const newColorIndex = selectedColorIndex + 1;
    if (darkcolors[newColorIndex])
        setColorIndex(newColorIndex);
    else
        setColorIndex(0);

}

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <input
          style={darkModeStatus ? {backgroundColor: darkcolors[selectedColorIndex]}:{backgroundColor: lightcolors[selectedColorIndex]}}
          className={darkModeStatus ? 'addtask-dark' : 'addtask-light'}
          type="text"
          name="inputGoal"
          placeholder={t('addGoalPlaceholder')}
          value={formInputData.inputGoal}
          onChange={handleChange}
        />
      </div>
      <div className={darkModeStatus ? 'mygoalsbutton-dark' : 'mygoalsbutton-light'}>
        <Button
        variant={darkModeStatus ? 'pink' : 'peach'}
        onClick={handleSubmit}
        className='addtask-button'>
         Add Task
        </Button>
      <div className='color-button'>
        <Button
         style={darkModeStatus ? {backgroundColor: darkcolors[selectedColorIndex]}:{backgroundColor: lightcolors[selectedColorIndex]}}
         onClick={changeColor} >
         Change color
        </Button>
      </div>
      </div>

      <div className="inputs">
        {
                    tableData.map((data,index) => (
                      <div
                      style={darkModeStatus ? {backgroundColor: darkcolors[index%5]}:{backgroundColor: lightcolors[index%5]}}
                      className={darkModeStatus ? 'addtask-dark' : 'addtask-light'}>
                        <div className={darkModeStatus ? 'deletetodo-dark' : 'deletetodo-light'} onClick={removeItem} />
                        <div className="input-goal">{data.inputGoal}</div>
                      </div>
                    ))
                }

      </div>
    </form>
  );
}
