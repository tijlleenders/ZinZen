import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { HeaderDashboard } from '../dashboard/HeaderDashboard';
import { MyFeelingsChoices } from './MyFeelingsChoices';
import { darkModeState } from '../../store/DarkModeState';
import '../../translations/i18n';
import './myfeelingspage.scss';

export function MyFeelings() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();

  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
        <Row>
          <Col>
            <h3 className={darkModeStatus ? 'my-feelings-font-dark' : 'my-feelings-font-light'}>{t('feelingsmessage')}</h3>
            <MyFeelingsChoices />
          </Col>
          <Col sm={1} />
        </Row>
      </Container>
    </div>
  );
}
