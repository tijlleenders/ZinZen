import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { displayPartner } from "@src/store";

import { getMyPartner } from "@src/api/PartnerAPI";
import { GoalItem } from "@src/models/GoalItem";
import GoalLocStateHandler from "@src/helpers/GoalLocStateHandler";

import { MyGoals } from "./MyGoals";
import PartnerGoals from "./PartnerGoals";
import "./GoalsPage.scss";

const GoalsPage = () => {
  const partner = useRecoilValue(displayPartner);
  const [partnerGoals, setPartnerGoals] = useState<GoalItem[]>([]);
  const getPartnerGoals = async () => {
    const myPartner = await getMyPartner();
    if (myPartner) {
      setPartnerGoals([...myPartner.goals]);
    }
  };
  useEffect(() => {
    getPartnerGoals();
  }, [partner]);

  return (
    <>
      <GoalLocStateHandler />
      {partner ? <PartnerGoals partnerGoals={partnerGoals} refreshGoals={getPartnerGoals} /> : <MyGoals />}
    </>
  );
};

export default GoalsPage;
