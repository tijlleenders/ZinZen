import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'
import { Nav, Navbar } from 'react-bootstrap';

const FeelingGratitude = () => {
    return (

        <div >
            <Container fluid>
                <div className="feelings-menu-desktop">
                    <Button variant="peach" size="lg" className="feelings-title">
                        Gratitude
                        &#128519;
                    </Button>
                    <br />
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Harmony
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Thankful
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Triumphed
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Worthy
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Satisfied
                    </Button>
                    <Button className="btn-my-feelings btn-feelings" size="lg">
                        Awed
                    </Button>
                </div>
                <div className="feelings-menu-mobile">
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle className="feelings-title">
                            Gratitude
                            &#128519;
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className="navbar-custom">
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Harmony
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Thankful
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Triumphed
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Worthy
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Satisfied
                                </Button>
                                <Button className="btn-my-feelings btn-feelings" size="lg">
                                    Awed
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </Container>
        </div>
    )
}

export default FeelingGratitude
