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
  const colors = ["green", "red", "orange"];
  const { t } = useTranslation();
  const [selectedColorIndex, setColorIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [formInputData, setFormInputData] = useState(
    {
      inputGoal: '',
      id:0,
    },
  );

  const handleChange = (e) => {
    const { value } = e.target;
    const idNum = Date.now();

    setFormInputData({
      ...formInputData,
      id:idNum,
      [e.target.name]: value,
    });
  };

  const handleSubmit = (e) => {
    if (formInputData.inputGoal) {
      const newData = (data) => ([...data, formInputData]);
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
    if (colors[newColorIndex])
        setColorIndex(newColorIndex);
     //   console.log(newColorIndex);
    else
        setColorIndex(0);

}

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <input
         style={{backgroundColor: colors[selectedColorIndex]}}
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
        variant={darkModeStatus ? 'dark-pink' : 'pale-blue'}
        onClick={handleSubmit}
        className='addtask-button'>
         Add Task
        </Button>
      <div className='color-button'>
        <Button
         style={{backgroundColor: colors[selectedColorIndex]}}
         onClick={changeColor} >
         Change color
        </Button>
      </div>
      </div>

      <div className="inputs">
        {
                    tableData.map((data,index) => (
                      <div
                      style={{backgroundColor: colors[index%4]}}
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
