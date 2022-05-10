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
  const { t } = useTranslation();
  const [tableData, setTableData] = useState([]);
  const [formInputData, setFormInputData] = useState(
    {
      inputGoal: '',
      inputTime: '',
      id: '',
    },
  );

  const handleChange = (e) => {
    const { value } = e.target;
    const id = Date.now();

    setFormInputData({
      ...formInputData,
      id,
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
      inputTime: '',
    });
    e.preventDefault();
  };

  const removeItem = () => {
    setTableData([]);
  };

  return (
    <form className="todo-form" onSubmit={handleSubmit}>
      <div>
        <input
          className={darkModeStatus ? 'addtask-dark' : 'addtask-light'}
          type="text"
          name="inputGoal"
          placeholder={t('addGoalPlaceholder')}
          value={formInputData.inputGoal}
          onChange={handleChange}
        />
      </div>
      <div className={darkModeStatus ? 'mygoalsbutton-dark' : 'mygoalsbutton-light'}>
        <Button variant={darkModeStatus ? 'dark-pink' : 'pink'} onClick={handleSubmit}>
         Add Task
        </Button>
        <Button>
         Change color
        </Button>
      </div>
      <div className="inputs">
        {
                    tableData.map((data) => (
                      <div className={darkModeStatus ? 'addtask-dark' : 'addtask-light'}>
                        <div className="input-time">{data.inputTime}</div>
                        <div className={darkModeStatus ? 'deletetodo-dark' : 'deletetodo-light'} onClick={removeItem} />
                        <div className="input-goal">{data.inputGoal}</div>
                      </div>
                    ))
                }

      </div>
    </form>
  );
}
