import React, { useState } from 'react'
import { Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../store/DarkModeState'
import "./TodoList.scss";
import AddIconLight from "../../assets/images/AddIconLight.png";
import AddIconDark   from "../../assets/images/AddIconDark.png";

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

    return (
        <form className='todo-form' onSubmit={handleSubmit}>
            <div>
                <input className={darkModeStatus ? "addtask-dark" : "addtask-light"}
                    type='text'
                    name='inputGoal'
                    placeholder='What do you want to achieve today?'
                    value={formInputData.inputGoal}
                    onChange={handleChange}
                />
            </div>
            <div>
                <input
                    className={darkModeStatus ? "addtaskdark-time" : "addtasklight-time"}
                    type='date'
                    placeholder='Add time'
                    name='inputTime'
                    value={formInputData.inputTime}
                    onChange={handleChange}
                />
            </div>

            <div className='inputs'>
                {
                    tableData.map((data,index) => {
                        const removeItem=(index)=>{
                        console.log(index)}
                        return (
                            <div key={index} className={darkModeStatus ? "addtask-dark" : "addtask-light"}>
                                <div className='input-time'>{data.inputTime}</div>
                                <div className={darkModeStatus ? "deletetodo-dark" : "deletetodo-light"} onClick={removeItem}></div>
                                <div className='input-goal'>{data.inputGoal}</div>
                            </div>
                        )
                    })
                }

            </div>

            <div className={darkModeStatus ? "mygoalsbutton-dark" : "mygoalsbutton-light"}>
                <Button variant={darkModeStatus ? "dark-pink" : "pink"} onClick={handleSubmit}>
                    <img src={darkModeStatus ? AddIconDark : AddIconLight} alt="Add Icon" className="add-icon" />
                </Button>
            </div>
            
        </form>
    )
}
