import React, { useEffect } from "react";
import { useRecoilState, useRecoilValue } from "recoil";

import { getMyPartner } from "@src/api/PartnerAPI";
import { displayShareModal } from "@src/store/GoalsState";
import { displayPartner, parntnerDetails } from "@src/store";
import GoalLocStateHandler from "@src/helpers/GoalLocStateHandler";

import { MyGoals } from "./MyGoals";
import PartnerGoals from "./PartnerGoals";
import "./GoalsPage.scss";

const GoalsPage = () => {
  const [partner, setPartner] = useRecoilState(parntnerDetails);
  const showPartner = useRecoilValue(displayPartner);
  const showShareModal = useRecoilValue(displayShareModal);

  const getPartnerGoals = async () => {
    const myPartner = await getMyPartner();
    if (myPartner) {
      setPartner(JSON.parse(JSON.stringify(myPartner)));
    }
  };
  useEffect(() => {
    getPartnerGoals();
  }, [showPartner, showShareModal]);

  return (
    <>
      <GoalLocStateHandler />
      {showPartner && partner ? <PartnerGoals partner={partner} refreshGoals={getPartnerGoals} /> : <MyGoals />}
    </>
  );
};

export default GoalsPage;
