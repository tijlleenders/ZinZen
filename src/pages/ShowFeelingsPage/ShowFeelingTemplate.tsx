/* eslint-disable react/prop-types */
import * as React from 'react';
import {
  Button, Nav, Container,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { darkModeState } from '@store';
import { IFeelingItem } from '@models';
import { removeFeeling } from '@api/FeelingsAPI';

import '@translations/i18n';
import './ShowFeelingsPage.scss';

interface IProps {
  feelingsListObject: IFeelingItem[],
  setFeelingsListObject: (newFeelingsList: IFeelingItem[]) => void,
  currentFeelingsList: IFeelingItem[],
}

export const ShowFeelingTemplate: React.FC<IProps> = ({ feelingsListObject, setFeelingsListObject, currentFeelingsList }) => {
  const { t } = useTranslation();
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <div>
      <Container fluid>
        <div className="feelings-menu-desktop">
          {feelingsListObject && Object.keys(feelingsListObject)
            .map(((feelingId: string) => (
              <Button
                key={feelingsListObject[Number(feelingId)].content}
                className={
                darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'
              }
                size="lg"
                onClick={() => {
                  removeFeeling(feelingsListObject[Number(feelingId)].id);
                  let newFeelingsList = currentFeelingsList;
                  const feelingDate = feelingsListObject[Number(feelingId)].date;
                  newFeelingsList[feelingDate] = currentFeelingsList[feelingDate].filter(
                    feelingsOnDate => feelingsOnDate.id !== feelingsListObject[Number(feelingId)].id
                  );
                  setFeelingsListObject(newFeelingsList);
                }}
              >
                {t(feelingsListObject[Number(feelingId)].content)}
              </Button>
            )))}
        </div>
        <div className="feelings-menu-mobile">
          <Nav className="navbar-custom">
            {feelingsListObject && Object.keys(feelingsListObject).map(
              ((feelingId: string) => (
                <Button
                  key={feelingsListObject[Number(feelingId)].content
                  + feelingsListObject[Number(feelingId)].date}
                  className={
                darkModeStatus ? 'btn-my-feelings-dark btn-feelings-dark' : 'btn-my-feelings-light btn-feelings-light'
              }
                  size="lg"
                  onClick={() => removeFeeling(feelingsListObject[Number(feelingId)].id)}
                >
                  {t(feelingsListObject[Number(feelingId)].content)}
                </Button>
              )),
            )}
          </Nav>
        </div>
      </Container>
    </div>
  );
};
