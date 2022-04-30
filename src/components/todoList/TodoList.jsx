import React from 'react'
import  {HeaderDashboard}  from "../dashboard/HeaderDashboard";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../store/DarkModeState'
import "../../translations/i18n";
import "./TodoList.scss"

export const TodoList=()=>{
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  return(
    <div>
      <row>
    <HeaderDashboard/>
     </row>
     <row>
     <h3 className={darkModeStatus ? "myGoals-font-dark" : "myGoals-font-light"}>{t("myGoalsMessage")}</h3>
     </row>
     </div>

     );
}