import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { darkModeState } from '@store';
import { AddFeelingsChoices } from './AddFeelingsChoices';

import '@translations/i18n';
import './AddFeelingsPage.scss';

export const AddFeelingsPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  return (
    <Container fluid>
      <Row>
        <Col>
          <h3 className={darkModeStatus ? 'my-feelings-font-dark' : 'my-feelings-font-light'}>
            {t('feelingsmessage')}
          </h3>
          <AddFeelingsChoices />
        </Col>
        <Col sm={1} />
      </Row>
    </Container>
  );
};
