import React from 'react'
import { useState } from 'react'
import { Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../store/DarkModeState'
import "./TodoList.scss";
import AddIconLight from "../../images/AddIconLight.png";
import AddIconDark from "../../images/AddIconDark.png";


export const TodoForm=()=> {
    const darkModeStatus = useRecoilValue(darkModeState);
    const {input,setInput}=useState('')
    const {date}=useState('')

  return (
      <form className='todo-form'>
       <div>
        <input
          variant={darkModeStatus ? "brown" : "peach"} className={darkModeStatus ? 'addTask-dark':'addTask-light' }
        type='text' placeholder='Add task' value={input}/>
       </div>
       <div className='addDate'> <input type='date' placeholder='Add time' value={date}/></div>
       <Button  variant={darkModeStatus ? "dark-pink" : "pink"} >
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
      </form>


  )
}
