import { darkModeState } from "@src/store";
import React from "react";
import { Breadcrumb, Container } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";

import "./GoalSublist.scss";

export const GoalSublist = () => {
  const darkModeStatus = useRecoilValue(darkModeState);

  const param = useParams();
  return (
    <div className={darkModeStatus ? "sublist-container-dark" : "sublist-container"}>
      <Breadcrumb>
        <Breadcrumb.Item className="breadcrumb-box" href="/Home/MyGoals/">
          My Goals
        </Breadcrumb.Item>
        <Breadcrumb.Item className="breadcrumb-box" href="#">
          {param.id}
        </Breadcrumb.Item>
      </Breadcrumb>
      <Container fluid>
        <div className="sublist-title">{param.id}</div>
      </Container>
    </div>
  );
};
