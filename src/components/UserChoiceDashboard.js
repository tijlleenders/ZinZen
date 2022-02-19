import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, Row, Col } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import "../translations/i18n"

const UserChoiceDashboard = () => {
  const { t } = useTranslation();
  return (
    <div>
      <Container fluid>
        <Row >
          <Button variant="peach" size="lg" className="dashboard-choice-btn1">{t("mygoals")}</Button>
        </Row>
        <Row >
          <Button variant="dark-pink" size="lg" className="dashboard-choice-btn">{t("myfeelings")}</Button>
        </Row>
        <Row >
          <Button variant="grey-base" size="lg" className="dashboard-choice-btn">{t("mytime")}</Button>
        </Row>
        <Row >
          <Button variant="pale-blue" size="lg" className="dashboard-choice-btn">{t("explore")}</Button>
        </Row>
        <Row >
          <Button variant="purple" size="lg" className="dashboard-choice-btn">{t("zinzen")}</Button>
        </Row>
      </Container>
    </div>
  )
}

export default UserChoiceDashboard
