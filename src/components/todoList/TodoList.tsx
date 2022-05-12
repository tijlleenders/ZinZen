import React from 'react';
import { Container, Row } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useRecoilValue } from 'recoil';

import { HeaderDashboard } from '@components/dashboard/HeaderDashboard';
import { darkModeState } from '@store';
import { TodoForm } from './TodoListForm';

import '@translations/i18n';
import './TodoList.scss';

export function TodoList() {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
        <Row>
          <h2 className={darkModeStatus ? 'mygoals-font-dark' : 'mygoals-font-light'}>{t('myGoalsMessage')}</h2>
           <div className={darkModeStatus ? 'goalsubtext-font-dark' : 'goalsubtext-font-light'}>
               <p>{t("goalsubtext")}
               <br></br> {t("format")}</p>
            </div>
        </Row>
        <Row>
          <TodoForm />
        </Row>
      </Container>
    </div>
  );
}
