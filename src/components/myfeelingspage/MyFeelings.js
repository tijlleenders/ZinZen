import React from "react";
import { Container, Row, Col } from "react-bootstrap";

import { HeaderDashboard } from "../dashboard/HeaderDashboard";
import { MyFeelingsChoices } from "./MyFeelingsChoices";

export const MyFeelings = () => {
    return (
        <div>
            <Container fluid>
                <Row>
                    <HeaderDashboard />
                </Row>
                <Row>
                    <Col>
                        <h3 className="my-feelings-font">
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
