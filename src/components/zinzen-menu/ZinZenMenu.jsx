import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { HeaderDashboard } from "../dashboard/HeaderDashboard";
import { UserChoiceZinZenMenu } from "./UserChoiceZinZenMenu";

export const ZinZenMenu = () => {
    return (
        <div>
            <Container fluid>
                <Row >
                    <HeaderDashboard />
                </Row>
                <Row>
                    <Col sm={4}></Col>
                    <Col sm={4}>
                        <UserChoiceZinZenMenu />
                    </Col>
                    <Col sm={4}></Col>
                </Row>
            </Container>
        </div>
    );
};