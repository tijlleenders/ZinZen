import React from 'react';
import {
  Button, Nav, Navbar, Container,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import '../../translations/i18n';
import './myfeelingspage.scss';

import { darkModeState } from '../../store/DarkModeState';

export function FeelingAfraid() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          <Button variant={darkModeStatus ? 'brown' : 'peach'} size="lg" className="feelings-title">
            {t('afraid')}
            &#128552;
          </Button>
          <br />
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('worried')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('doubtful')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('nervous')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('anxious')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('panicked')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('stressed')}
          </Button>
        </div>
        <div className="feelings-menu-mobile">
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Toggle className={darkModeStatus ? 'feelings-title-dark' : 'feelings-title-light'}>
              {t('afraid')}
              &#128552;
            </Navbar.Toggle>
            <Navbar.Collapse>
              <Nav className="navbar-custom">
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('worried')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('doubtful')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('nervous')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('anxious')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('panicked')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('stressed')}
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </Container>
    </div>
  );
}
