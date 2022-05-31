import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { getAllFeelings } from '@api/FeelingsAPI';
import { IFeelingItem } from '@models';
import { darkModeState } from '@store';
import { ShowFeelingTemplate } from './ShowFeelingTemplate';

import './ShowFeelingsPage.scss';
import './ShowFeelings.scss';

export const ShowFeelingsPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const [feelingsList, setFeelingsList] = useState<IFeelingItem[]>(null);

  useEffect(() => {
    const getData = async () => {
      const allFeelings = await getAllFeelings();
      const feelingsByDates = allFeelings.reduce((dates: Date[], feeling: IFeelingItem) => {
        // @ts-ignore
        if (dates[feeling.date]) {
          // @ts-ignore
          dates[feeling.date].push(feeling);
        } else {
          // @ts-ignore
          dates[feeling.date] = [feeling];
        }
        return dates;
      }, {});
      setFeelingsList(feelingsByDates);
    };
    getData();
  }, []);

  const handleFeelingsListChange = (newFeelingsList) => {
    setFeelingsList(newFeelingsList);
  }
  console.log(feelingsList);
  return (
    <Container fluid>
      <Row>
        <Col>
          <h3 className={darkModeStatus ? 'my-feelings-font-dark' : 'my-feelings-font-light'}>{t('showfeelingsmessage')}</h3>
          {feelingsList !== null && Object.keys(feelingsList).map((date) => (
            <div
              key={feelingsList[date]}
              className="show-feelings__list-category"
            >
              <h3 className={darkModeStatus
                ? 'my-feelings-font-dark'
                : 'my-feelings-font-light'}
              >
                {new Date(date).toDateString()}
              </h3>
              <ShowFeelingTemplate
                key={feelingsList[date]}
                feelingsListObject={feelingsList[date]}
                setFeelingsListObject={handleFeelingsListChange}
                currentFeelingsList={feelingsList}
              />
            </div>
          ))}
        </Col>
        <Col sm={1} />
      </Row>
    </Container>
  );
};
