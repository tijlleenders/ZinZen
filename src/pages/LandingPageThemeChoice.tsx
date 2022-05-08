import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ThemesChoice } from './ThemesChoice';
import { HeaderThemeChoice } from '../components/themechoicepage/HeaderThemeChoice';

import '@translations/i18n';
import '@components/themechoicepage/themechoice.scss';

export function LandingPageThemeChoice() {
  const { t } = useTranslation();
  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderThemeChoice />
        </Row>
        <Row>
          <Col sm={1} />
          <Col>
            <h3 className="theme-choice-panel-font">
              {t('themechoice')}
            </h3>
            <ThemesChoice />
          </Col>
          <Col sm={1} />
        </Row>
      </Container>
    </div>
  );
}
