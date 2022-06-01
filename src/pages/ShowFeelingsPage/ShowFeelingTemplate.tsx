/* eslint-disable react/prop-types */
import React from 'react';
import {
  Button, Nav, Container,
} from 'react-bootstrap';
import { useRecoilValue } from 'recoil';
import { useTranslation } from 'react-i18next';

import { darkModeState } from '@store';
import { IFeelingItem } from '@models';
import { removeFeeling } from '@api/FeelingsAPI';
import { feelingListType } from '@src/global';

import '@translations/i18n';
import './ShowFeelingsPage.scss';

interface ISetFeelingsListObject {
  feelingsList: feelingListType[],
  setFeelingsList: React.Dispatch<React.SetStateAction<feelingListType[]>>
}

interface IProps {
  feelingsListObject: IFeelingItem[],
  setFeelingsListObject: ISetFeelingsListObject,
  currentFeelingsList: feelingListType[],
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
                  const numFeelingId = feelingsListObject[Number(feelingId)].id;
                  if (numFeelingId !== undefined)
                    removeFeeling(numFeelingId);
                  else
                    console.log("Attempting to remove feeling not in the database");

                    let newFeelingsList = currentFeelingsList;
                  const feelingDate = feelingsListObject[Number(feelingId)].date;
                  newFeelingsList[feelingDate] = currentFeelingsList[feelingDate].filter(
                    (feelingOnDate: IFeelingItem) => feelingOnDate.id !== numFeelingId
                  );
                  setFeelingsListObject.setFeelingsList({...newFeelingsList});
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
                  onClick={() => {
                    const numFeelingsId = feelingsListObject[Number(feelingId)].id;
                    if(numFeelingsId !== undefined)
                      removeFeeling(numFeelingsId);
                    else
                      console.log("Attempting to remove feeling not in the database");
                  }}
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
