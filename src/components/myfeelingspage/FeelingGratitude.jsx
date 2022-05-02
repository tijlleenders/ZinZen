import React from 'react';
import {
  Button, Nav, Navbar, Container,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';

import { useTranslation } from 'react-i18next';
import { darkModeState } from '../../store/DarkModeState';
import '../../translations/i18n';
import './myfeelingspage.scss';

export function FeelingGratitude() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          <Button variant={darkModeStatus ? 'brown' : 'peach'} size="lg" className="feelings-title">
            {t('gratitude')}
            &#128519;
          </Button>
          <br />
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('harmony')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('thankful')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('triumphed')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('worthy')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('satisfied')}
          </Button>
          <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
            {t('awed')}
          </Button>
        </div>
        <div className="feelings-menu-mobile">
          <Navbar collapseOnSelect expand="lg">
            <Navbar.Toggle className={darkModeStatus ? 'feelings-title-dark' : 'feelings-title-light'}>
              {t('gratitude')}
              &#128519;
            </Navbar.Toggle>
            <Navbar.Collapse>
              <Nav className="navbar-custom">
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('harmony')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('thankful')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('triumphed')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('worthy')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('satisfied')}
                </Button>
                <Button className={darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'} size="lg">
                  {t('awed')}
                </Button>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
      </Container>
    </div>
  );
}
