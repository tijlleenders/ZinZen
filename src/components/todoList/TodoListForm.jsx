import React,{useState} from 'react'
import { Button } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../store/DarkModeState'
import "./TodoList.scss";
import AddIconLight from "../../images/AddIconLight.png";
import AddIconDark from "../../images/AddIconDark.png";


export const TodoForm=()=> {
    const darkModeStatus = useRecoilValue(darkModeState);
    const [tableData,setTableData]=useState({
        inputGoal:'',
        inputTime:''
    })
    const [formInputData, setFormInputData] = useState(
        {
        inputGoal:'',
        inputTime:''
       }
    );

    const handleChange=(e)=>{
        const value = e.target.value;
       setFormInputData({ ...formInputData,
        [e.target.name]:value
        })
       }

    const handleSubmit=(e)=>{
        e.preventDefault();
        setTableData({...formInputData,
        [e.target.name]:e.target.value
        });
        setFormInputData({
          inputGoal:'',
          inputTime:''
          })

    }


  return (
      <form className='todo-form' onSubmit={handleSubmit}>
       <div>
        <input  className={darkModeStatus ? "addTaskDark" : "addTaskLight"}
        type='text'
        name='inputGoal'
         placeholder='Add task'
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

        <table className="table">
            <thead>
                <tr>
                    <th>S.N</th>
                    <th>Full Name</th>
                    <th>Email Address</th>
                    <th>Salary</th>
                </tr>
            </thead>
            <tbody>
            {
                tableData.map((data, index)=>{
                    return(
                        <tr key={index}>
                            <td>{index+1}</td>
                            <td>{data.fullName}</td>
                            <td>{data.emailAddress}</td>
                            <td>{data.salary}</td>
                        </tr>
                    )
                })
            }
            </tbody>
        </table>
    

        <div  className={darkModeStatus ? "myGoalsButton-Dark" : "myGoalsButton-Light"}>
       <Button variant={darkModeStatus ? "dark-pink" : "pink"}
         onClick={handleSubmit}
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
