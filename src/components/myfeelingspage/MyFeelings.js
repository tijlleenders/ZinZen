import React from 'react'
import Header from '../dashboard/HeaderDashboard'
import MyFeelingsChoices from './MyFeelingsChoices'
import { Container, Row, Col } from 'react-bootstrap'
import { darkModeState } from '../../store/DarkModeState'
import { useRecoilState } from 'recoil'
import { useTranslation } from "react-i18next"
import "../../translations/i18n"

const MyFeelings = () => {
  const [darkModeStatus, setDarkModeStatus] = useRecoilState(darkModeState);
  const { t } = useTranslation();

  return (
    <div>
      <Container fluid >
                <Row >
                    <Header />
                </Row>
                <Row >
                    <Col >
                    <h3 className={darkModeStatus ? "my-feelings-font-dark" : "my-feelings-font-light"}>{t("feelingsmessage")}</h3>
                    <MyFeelingsChoices />
                    </Col>
                    <Col sm={1}></Col>
                </Row>
            </Container>
    </div>
  )
}

export default MyFeelings
