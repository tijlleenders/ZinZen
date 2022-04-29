import React from 'react'
import { HeaderDashboard } from "../dashboard/HeaderDashboard";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../store/DarkModeState'
import "../../translations/i18n";

export const TodoList=()=>{
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  return(
    <div>
    <HeaderDashboard/>
     <h1>Add a Goal</h1> 
     </div>);
}