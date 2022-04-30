import React from 'react'
import { Container, Row, Col } from "react-bootstrap";
import  {HeaderDashboard}  from "../dashboard/HeaderDashboard";
import { useTranslation } from "react-i18next";
import { useRecoilValue } from 'recoil';
import { darkModeState } from '../../store/DarkModeState'
import "../../translations/i18n";
import "./TodoList.scss"
import {TodoForm} from './TodoListForm'

export const TodoList=()=>{
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  return(
    <div>
      <Container fluid>
      <Row>
    <HeaderDashboard/>
     </Row>
     <Row>
     <h2 className={darkModeStatus ? "myGoals-font-dark" : "myGoals-font-light"}>{t("myGoalsMessage")}</h2>
     </Row>
     <Row>
       <TodoForm/>
     </Row>
     </Container>
     </div>

     );
}