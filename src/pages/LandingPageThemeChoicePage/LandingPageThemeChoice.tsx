import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

import { ThemeChoice } from '@components/ThemeChoice/ThemeChoice';
import { HeaderThemeChoice } from '@components/ThemeChoice/HeaderThemeChoice';

import '@translations/i18n';
import '@components/ThemeChoice/ThemeChoice.scss';

export const LandingPageThemeChoice = () => {
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
            <ThemeChoice />
          </Col>
          <Col sm={1} />
        </Row>
      </Container>
    </div>
  );
};
