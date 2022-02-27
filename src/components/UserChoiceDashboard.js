import React from 'react'
import { Button, } from 'react-bootstrap'
import { useRecoilState } from 'recoil'
import { darkModeState } from '../store/DarkModeState'
import { Container, Row } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import "../translations/i18n"

const UserChoiceDashboard = () => {
  const { t } = useTranslation();
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  console.log(darkModeStatus)

  return (
    <div>
      <Container fluid>
        <Row >
          <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className={darkModeStatus ? "dashboard-choice-dark1" : "dashboard-choice-light1"}>{t("mygoals")}</Button>
        </Row>
        <Row >
          <Button variant={darkModeStatus ? "dark-pink" : "pink"} size="lg" className={darkModeStatus ? "dashboard-choice-dark" : "dashboard-choice-light"}>{t("myfeelings")}</Button>
        </Row>
        <Row >
          <Button variant={darkModeStatus ? "dark-grey" : "grey-base"}  size="lg" className={darkModeStatus ? "dashboard-choice-dark" : "dashboard-choice-light"}>{t("mytime")}</Button>
        </Row>
        <Row >
          <Button variant={darkModeStatus ? "dark-blue" : "pale-blue"} size="lg" className={darkModeStatus ? "dashboard-choice-dark" : "dashboard-choice-light"}>{t("explore")}</Button>
        </Row>
        <Row >
          <Button variant={darkModeStatus ? "dark-purple" : "purple"}  size="lg" className={darkModeStatus ? "dashboard-choice-dark" : "dashboard-choice-light"}>{t("zinzen")}</Button>
        </Row>
      </Container>
    </div>
  )
}

export default UserChoiceDashboard
