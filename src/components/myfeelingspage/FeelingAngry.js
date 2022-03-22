import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'
import { Nav, Navbar } from 'react-bootstrap';

const FeelingAngry = () => {
    return (
        <div >
            <Container fluid>
                <div className="feelings-menu-desktop">
                    <Button variant="peach" size="lg" className="feelings-title">
                        Angry
                        &#128544;
                    </Button>
                    <br />
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Annoyed
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Frustated
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Bitter
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Infuriated
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Mad
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Insulted
                    </Button>
                </div>
                <div className="feelings-menu-mobile">
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle className="feelings-title">
                            Angry
                            &#128544;
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className="navbar-custom">
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Annoyed
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Frustated
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Bitter
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Infuriated
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Mad
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Insulted
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </Container>
        </div>
    )
}

export default FeelingAngry
