import React from "react";
import { Button, Nav, Navbar, Container} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';

import { darkModeState } from '../../store/DarkModeState';
import { useTranslation } from "react-i18next";
import "../../translations/i18n";

export const FeelingSad = () => {
    const darkModeStatus = useRecoilValue(darkModeState);
    const { t } = useTranslation();
    return (
        <div>
            <Container fluid>
                <div className="feelings-menu-desktop">
                    <Button variant={darkModeStatus ? "brown" : "peach"} size="lg" className="feelings-title">
                        {t("sad")}
                        &#128577;
                    </Button>
                    <br />
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("sad")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("lonely")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("gloomy")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("disappointed")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("miserable")}
                    </Button>
                    <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                        {t("hopeless")}
                    </Button>
                </div>
                <div className="feelings-menu-mobile">
                    <Navbar collapseOnSelect expand="lg">
                        <Navbar.Toggle className={darkModeStatus ? "feelings-title-dark" : "feelings-title-light"}>
                            {t("sad")}
                            &#128577;
                        </Navbar.Toggle>
                        <Navbar.Collapse>
                            <Nav className="navbar-custom">
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("sad")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("lonely")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("gloomy")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("disappointed")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("miserable")}
                                </Button>
                                <Button className={darkModeStatus ? "btn-my-feelings-dark btn-feelings-dark" : "btn-my-feelings-light btn-feelings-light"} size="lg">
                                    {t("hopeless")}
                                </Button>
                            </Nav>
                        </Navbar.Collapse>
                    </Navbar>
                </div>
            </Container>
        </div>
    );
};
