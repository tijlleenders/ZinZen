import React,{useState} from 'react'
import { Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../store/DarkModeState'
import "./TodoList.scss";
import AddIconLight from "../../images/AddIconLight.png";
import AddIconDark from "../../images/AddIconDark.png";


export const TodoForm=()=> {
    const darkModeStatus = useRecoilValue(darkModeState);
    const {input,setInput}=useState('')
    const {date,setDate}=useState('')


  return (
      <form className='todo-form'>
       <div>
        <input  className={darkModeStatus ? "addTaskDark" : "addTaskLight"}
        type='text' placeholder='Add task' value={input}/>
       </div>
       <div>
          <input
           className={darkModeStatus ? "addTaskDark-time" : "addTaskLight-time"}
           type='date' placeholder='Add time' value={date}/>
        </div>
        <div  className={darkModeStatus ? "myGoalsButton-Dark" : "myGoalsButton-Light"}>
       <Button variant={darkModeStatus ? "dark-pink" : "pink"}

       >
       {darkModeStatus ? (
                           <img
                                src={AddIconDark}
                                alt="Add Icon"
                                className="add-icon"
                            />
                        ) : (
                            <img
                                src={AddIconLight}
                                alt="Add Icon"
                                className="add-icon"


                                />)}
       </Button>
      </div>
      </form>


  )
}
