import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { darkModeState } from '@store';

import '@translations/i18n';
import './TodoList.scss';

export function TodoForm() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const darkcolors = ['#443027', ' #9C4663', '#646464', '#2B517B', '#612854'];
  const lightcolors = [' #EDC7B7', '#AC3B61', ' #BAB2BC', '#3B6899', '#8E3379'];
  const { t } = useTranslation();
  const [selectedColorIndex, setColorIndex] = useState(0);
  const [tableData, setTableData] = useState([]);
  const [formInputData, setFormInputData] = useState(
    {
      inputGoal: '',
      id: '',
    },
  );

  const handleChange = (e:any) => {
    const { value } = e.target;
    const idNum = crypto.randomUUID();

    setFormInputData({
      ...formInputData,
      id: idNum,
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
      id: '',
    });
    e.preventDefault();
  };

  const removeItem = () => {
    setTableData([]);
  };
  function suggestion() {
    if (formInputData.inputGoal.indexOf('daily') !== -1) {
      return 'daily';
    }
    return '';
  }
  function duration() {
    const tracker = /(1[0-9]|2[0-4]|[1-9])+(h)/;
    const label = /1[0-9]|2[0-4]|[0-9]/;
    const matchGoal = formInputData.inputGoal.match(label);
    if (formInputData.inputGoal.search(tracker) !== -1) {
      return `${matchGoal} hours`;
    }
    return '';
  }
  const changeColor = () => {
    const newColorIndex = selectedColorIndex + 1;
    if (darkcolors[newColorIndex]) { setColorIndex(newColorIndex); } else { setColorIndex(0); }
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <input
          style={darkModeStatus
            ? { backgroundColor: darkcolors[selectedColorIndex] }
            : { backgroundColor: lightcolors[selectedColorIndex] }}
          className={darkModeStatus ? 'addtask-dark' : 'addtask-light'}
          type="text"
          name="inputGoal"
          placeholder={t('addGoalPlaceholder')}
          value={formInputData.inputGoal}
          onChange={handleChange}
        />
      </div>
      <div className="duration">
      <button
        className={duration() !== '' ? 'duration' : 'blank'}
      >
        {duration()}
      </button>
      <button
        className={suggestion() === 'daily' ? 'suggestion' : 'blank'}
      >
        {suggestion()}
      </button>
      </div>
      <div className={darkModeStatus ? 'mygoalsbutton-dark' : 'mygoalsbutton-light'}>
        <Button
          variant={darkModeStatus ? 'pink' : 'peach'}
          onClick={handleSubmit}
          className="addtask-button"
        >
          Add Task
        </Button>
        <div className="changeColor">
          <button
            className="color-button"
            style={darkModeStatus
              ? { backgroundColor: darkcolors[selectedColorIndex] }
              : { backgroundColor: lightcolors[selectedColorIndex] }}
            onClick={changeColor}
          >
            Change color
          </button>
        </div>
      </div>

      <div className="inputs">
        {
                    tableData.map((data, index) => (
                      <div
                      key={index}
                        style={darkModeStatus
                          ? { backgroundColor: darkcolors[index % 5] }
                          : { backgroundColor: lightcolors[index % 5] }}
                        className={darkModeStatus ? 'addtask-dark' : 'addtask-light'}
                      >
                        <div className={darkModeStatus ? 'deletetodo-dark' : 'deletetodo-light'}
                          onClick={removeItem}
                        />
                        <div className="input-goal">{data.inputGoal}</div>
                      </div>
                    ))
                }
      </div>
    </form>
  );
}
