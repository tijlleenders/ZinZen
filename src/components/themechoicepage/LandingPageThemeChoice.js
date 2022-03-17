import React from 'react'
import HeaderThemeChoice from './HeaderThemeChoice';
import { Container, Row, Col } from 'react-bootstrap'
import ThemesChoice from './ThemesChoice'
import { useRecoilState } from 'recoil'
import { useTranslation } from "react-i18next";
import "../../translations/i18n"


const LandingPageThemeChoice = () => {
    const { t } = useTranslation();
    return (
        <div >
            <Container fluid >
                <Row >
                    <HeaderThemeChoice />
                </Row>
                <Row >
                  <Col sm={1}></Col>
                    <Col >
                    <h3 className="theme-choice-panel-font">{t("themechoice")}</h3>
                        <ThemesChoice />
                    </Col>
                    <Col sm={1}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default LandingPageThemeChoice
