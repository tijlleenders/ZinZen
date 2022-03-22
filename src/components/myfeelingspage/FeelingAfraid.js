import React from 'react'
import { Button, } from 'react-bootstrap'
import { Container, } from 'react-bootstrap'
import { Nav, Navbar } from 'react-bootstrap';

const FeelingAfraid = () => {
    return (
        <div >
        <Container fluid>
            <div className="feelings-menu-desktop">
                <Button variant="peach" size="lg" className="feelings-title">
                    Afraid
                    &#128552;
                </Button>
                <br />
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Worried
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Doubtful
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Nervous
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Anxious
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Panicked
                </Button>
                <Button className="btn-my-feelings btn-feelings" size="lg">
                    Stressed
                </Button>
            </div>
            <div className="feelings-menu-mobile">
                <Navbar collapseOnSelect expand="lg">
                    <Navbar.Toggle className="feelings-title">
                        Afraid
                        &#128552;
                    </Navbar.Toggle>
                    <Navbar.Collapse>
                        <Nav className="navbar-custom">
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Worried
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Doubtful
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Nervous
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Anxious
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Panicked
                            </Button>
                            <Button className="btn-my-feelings btn-feelings" size="lg">
                                Stressed
                            </Button>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        </Container>
    </div>
    )
}

export default FeelingAfraid
