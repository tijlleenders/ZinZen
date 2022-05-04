import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../store/DarkModeState'
import "./TodoList.scss";
import AddIconLight from "../../images/AddIconLight.png";
import AddIconDark from "../../images/AddIconDark.png";


export const TodoForm = () => {
    const darkModeStatus = useRecoilValue(darkModeState);
    const [tableData, setTableData] = useState([])
    const [formInputData, setFormInputData] = useState(
        {
            inputGoal: '',
            inputTime: ''
        }
    );

    const handleChange = (e) => {
        const value = e.target.value;
        setFormInputData({
            ...formInputData,
            [e.target.name]: value
        })
    }

    const handleSubmit = (e) => {
        if (formInputData.inputGoal) {
            const newData = (data) => ([...data, formInputData])
            setTableData(newData);
        }
        setFormInputData({
            inputGoal: '',
            inputTime: ''
        })

        e.preventDefault();
    }


      const deleteTodo=(e)=>{
          setTableData([])
          e.preventDefault
      }



    return (
        <form className='todo-form' onSubmit={handleSubmit}>
            <div>
                <input className={darkModeStatus ? "addTaskDark" : "addTaskLight"}
                    type='text'
                    name='inputGoal'
                    placeholder='What do you want to achieve today?'
                    value={formInputData.inputGoal}
                    onChange={handleChange}
                />
            </div>
            <div>
                <input
                    className={darkModeStatus ? "addTaskDark-time" : "addTaskLight-time"}
                    type='date'
                    placeholder='Add time'
                    name='inputTime'
                    value={formInputData.inputTime}
                    onChange={handleChange}
                />
            </div>

            <div className='inputs'>
                {
                    tableData.map((data) => {
                        return (
                            <div className={darkModeStatus ? "addTaskDark" : "addTaskLight"}>
                                <div className='inputTime'>{data.inputTime}</div>
                                <div className='deleteTodo' onClick={deleteTodo}></div>
                                <div className='inputGoal'>{data.inputGoal}</div>
                            </div>
                        )
                    })
                }

            </div>

            <div className={darkModeStatus ? "myGoalsButton-Dark" : "myGoalsButton-Light"}>
                <Button variant={darkModeStatus ? "dark-pink" : "pink"} onClick={handleSubmit}>
                    <img src={darkModeStatus ? AddIconDark : AddIconLight} alt="Add Icon" className="add-icon" />
                </Button>
            </div>
        </form>
    )
}
