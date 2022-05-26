import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { darkModeState } from '@store';
import { GoalsForm } from '@components/GoalsComponents/GoalsForm';

import '@translations/i18n';
import '@components/GoalsComponents/GoalsComponents.scss';

export const GoalsPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  return (
    <Container fluid>
      <Row className="position">
        <h2 className={darkModeStatus ? 'mygoals-font-dark' : 'mygoals-font-light'}>{t('myGoalsMessage')}</h2>
        <div className={darkModeStatus ? 'goalsubtext-font-dark' : 'goalsubtext-font-light'}>
          <p>
            {t('goalsubtext')}
            <br />
            {' '}
            {t('format')}
          </p>
        </div>
      </Row>
      <Row>
        <GoalsForm />
      </Row>
    </Container>
  );
};
