import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

import { getAllFeelings } from '@api/FeelingsAPI';
import { IFeelingItem } from '@models';
import { darkModeState } from '@store';
import { ShowFeelingTemplate } from './ShowFeelingTemplate';
import { feelingListType } from '@src/global';
import { getDates } from '@utils';
import addIcon from '@assets/images/GoalsAddIcon.svg';

import './ShowFeelingsPage.scss';
import './ShowFeelings.scss';

export const ShowFeelingsPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [feelingsList, setFeelingsList] = useState<feelingListType[]>([]);
  useEffect(() => {
    const getData = async () => {
      const allFeelings = await getAllFeelings();
      // @ts-ignore
      const feelingsByDates: feelingListType[] = allFeelings.reduce((dates: Date[], feeling: IFeelingItem) => {
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
  const dateArr = Object.keys(feelingsList).map((date) => {return date});
  const dateRangeArr = getDates(new Date(dateArr[0]), new Date());

  return (
    <Container fluid className="slide show-feelings__container">
      <Row>
        <Col>
          <h3 className={darkModeStatus ? 'my-feelings-font-dark' : 'my-feelings-font-light'}>{t('showfeelingsmessage')}</h3>
          {feelingsList !== null && dateRangeArr.map((date) => (
            <div
              key={date}
              className="show-feelings__list-category"
            >
              <h3 className={darkModeStatus
                ? 'my-feelings-font-dark'
                : 'my-feelings-font-light'}
              >
                <span
                  onClick={() => {
                    navigate('/Home/AddFeelings', {
                      state: {feelingDate: new Date(date)}
                    });
                  }}
                  style={{ cursor: 'pointer' }}
                >
                  {new Date(date).toDateString() === new Date().toDateString() ? 'Today' : new Date(date).toDateString()}
                </span>
              </h3>
              {feelingsList[date]
                ? <ShowFeelingTemplate
                  key={date}
                  feelingsListObject={feelingsList[date]}
                  setFeelingsListObject={{ feelingsList, setFeelingsList }}
                  currentFeelingsList={feelingsList}
                />
                : <img
                    key={date}
                    src={addIcon}
                    alt="add-goal"
                    style={{margin: '5px 0 0 30px', height: '30px', width: '30px'}}
                    onClick={() => {
                      navigate('/Home/AddFeelings', {
                        state: {feelingDate: new Date(date)}
                      });
                    }}
                  />
              }
            </div>
          ))}
        </Col>
      </Row>
    </Container>
  );
};
