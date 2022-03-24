import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { HeaderDashboard } from "../dashboard/HeaderDashboard";
import { MyFeelingsChoices } from "./MyFeelingsChoices";
import { darkModeState } from '../../store/DarkModeState'
import { useRecoilValue } from 'recoil'

export const MyFeelings = () => {
    const darkModeStatus = useRecoilValue(darkModeState);
    return (
        <div>
            <Container fluid>
                <Row>
                    <HeaderDashboard />
                </Row>
                <Row>
                    <Col>
                        <h3 className={darkModeStatus ? "my-feelings-font-dark" : "my-feelings-font-light"}>
                            Hi! How do you feel today?
                        </h3>
                        <MyFeelingsChoices />
                    </Col>
                    <Col sm={1}></Col>
                </Row>
            </Container>
        </div>
    );
};
