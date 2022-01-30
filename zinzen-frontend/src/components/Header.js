import React, { Component } from 'react'
import { Navbar, Container, Nav} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import ToggleSwitch from "./ToggleSwitch";

class Header extends Component {
        render() {
                return (
                        <Navbar bg="primary-base" className="navbarCont">
                                <Container className="navbarCont">
                                        <Nav className="me-auto navbarCont">
                                                <Nav.Link href="#home">Home</Nav.Link>
                                                <Nav.Link href="#discover">Discover</Nav.Link>
                                                <Nav.Link href="#donate">Donate</Nav.Link>
                                                <button>Dark</button>
                                        </Nav>
                                </Container>
                        </Navbar>

                );
        }
}



export default Header
