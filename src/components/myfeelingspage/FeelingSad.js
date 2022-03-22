import React from 'react'
import { Button, } from 'react-bootstrap'
import { Nav, Navbar } from 'react-bootstrap';
import { Container, } from 'react-bootstrap'


const FeelingSad = () => {
    return (
        <div >
            <Container fluid>
                <div className="feelings-menu-desktop">
                    <Button variant="peach" size="lg" className="feelings-title">
                        Sad
                        &#128577;
                    </Button>
                    <br />
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Sad
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Lonely
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Gloomy
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Disappointed
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Miserable
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Hopeless
                    </Button>
                </div>
                <div className="feelings-menu-mobile">
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle className="feelings-title">
                            Sad
                            &#128577;
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className="navbar-custom">
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Sad
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Lonely
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Gloomy
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Disappointed
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Miserable
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Hopeless
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </Container>
        </div>
    )
}

export default FeelingSad
