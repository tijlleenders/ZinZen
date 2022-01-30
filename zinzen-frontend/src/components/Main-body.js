import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import Left from './Left'
import Middle from './Middle'
import Right from './Right'

const Mainbody = () => {
    return (
        <div className="h-100 d-inline-block">
            <Container fluid>
                <Row >
                <Col sm={1}></Col>
                    <Col sm ><Left /></Col>
                    <Col sm><Middle /></Col>
                    <Col sm><Right /></Col>
                    <Col sm={1}></Col>
                </Row>
            </Container>
        </div>
    )
}

export default Mainbody
