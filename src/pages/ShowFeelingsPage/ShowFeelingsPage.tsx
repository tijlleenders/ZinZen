// @ts-nocheck
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useRecoilValue } from "recoil";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";

import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";
import { getAllFeelings, isCollectionEmpty } from "@api/FeelingsAPI";
import { IFeelingItem } from "@models";
import { darkModeState } from "@store";
import { feelingListType } from "@src/global";
import { getDates } from "@utils";
import addIcon from "@assets/images/GoalsAddIcon.svg";
import { ShowFeelingTemplate } from "./ShowFeelingTemplate";

import "./ShowFeelingsPage.scss";
import "./ShowFeelings.scss";

export const ShowFeelingsPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [feelingsList, setFeelingsList] = useState<feelingListType[]>([]);
  const [selectedFeeling, setSelectedFeeling] = useState<number>();
  useEffect(() => {
    const getData = async () => {
      const allFeelings = await getAllFeelings();
      const feelingsByDates: feelingListType[] = allFeelings.reduce((dates: Date[], feeling: IFeelingItem) => {
        if (dates[feeling.date]) {
          dates[feeling.date].push(feeling);
        } else {
          // eslint-disable-next-line no-param-reassign
          dates[feeling.date] = [feeling];
        }
        return dates;
      }, {});
      setFeelingsList(feelingsByDates);
    };
    getData();
  }, []);
  const dateArr = Object.keys(feelingsList).map((date) => date);
  const dateRangeArr = getDates(new Date(dateArr[0]), new Date()).reverse();
  useEffect(() => {
    async function checkCollection() {
      const result = await isCollectionEmpty();
      return result;
    }
    checkCollection().then((result) => {
      const timer1 = setTimeout(() => {
        if (result) {
          navigate("/Home/AddFeelings", {
            state: { feelingDate: new Date() },
          });
        }
      }, 500);
      return () => {
        clearTimeout(timer1);
      };
    });
  }, []);

  return (
    <div>
      <Container fluid>
        <Row>
          <HeaderDashboard />
        </Row>
      </Container>
      <Container fluid className="slide show-feelings__container">
        <Row>
          <Col>
            <h3 className={darkModeStatus ? "my-feelings-font-dark" : "my-feelings-font-light"}>
              {t("showfeelingsmessage")}
            </h3>
            {feelingsList !== null &&
            dateRangeArr.map((date) => (
              <div key={date} className="show-feelings__list-category">
                <h3 className={darkModeStatus ? "my-feelings-font-dark" : "my-feelings-font-light"}>
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      navigate("/Home/AddFeelings", {
                        state: { feelingDate: new Date(date) },
                      });
                    }}
                    onKeyDown={() => {
                      navigate("/Home/AddFeelings", {
                        state: { feelingDate: new Date(date) },
                      });
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    {new Date(date).toDateString() === new Date().toDateString()
                      ? "Today"
                      : new Date(date).toDateString()}
                  </span>
                </h3>
                {feelingsList[date] && feelingsList[date].length > 0 ? (
                  <ShowFeelingTemplate
                    key={date}
                    feelingsListObject={feelingsList[date]}
                    setFeelingsListObject={{ feelingsList, setFeelingsList }}
                    currentFeelingsList={feelingsList}
                    handleFocus={{ selectedFeeling, setSelectedFeeling }}
                  />
                ) : (
                  <input
                    type="image"
                    tabIndex={0}
                    key={date}
                    src={addIcon}
                    alt="add-goal"
                    style={{ margin: "5px 0 0 30px", height: "30px", width: "30px" }}
                    onClick={() => {
                      navigate("/Home/AddFeelings", {
                        state: { feelingDate: new Date(date) },
                      });
                    }}
                    onKeyDown={() => {
                      navigate("/Home/AddFeelings", {
                        state: { feelingDate: new Date(date) },
                      });
                    }}
                  />
                )}
              </div>
            ))}
          </Col>
        </Row>
      </Container>
    </div>
  );
};
