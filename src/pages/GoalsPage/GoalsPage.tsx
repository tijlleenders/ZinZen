import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

import { displayPartner } from "@src/store";

import { getMyPartner } from "@src/api/PartnerAPI";
import { GoalItem } from "@src/models/GoalItem";
import { MyGoals } from "./MyGoals";
import PartnerGoals from "./PartnerGoals";
import "./GoalsPage.scss";

const GoalsPage = () => {
  const partner = useRecoilValue(displayPartner);
  console.log("🚀 ~ file: GoalsPage.tsx:14 ~ GoalsPage ~ partner:", partner)
  const [partnerGoals, setPartnerGoals] = useState<GoalItem[]>([]);
  console.log("🚀 ~ file: GoalsPage.tsx:15 ~ GoalsPage ~ partnerGoals:", partnerGoals)
  const getPartnerGoals = async () => {
    const myPartner = await getMyPartner();
    if (myPartner) {
      setPartnerGoals([...myPartner.goals]);
    }
  };
  useEffect(() => {
    getPartnerGoals();
  }, [partner]);

  return partner ? <PartnerGoals partnerGoals={partnerGoals} refreshGoals={getPartnerGoals} /> : <MyGoals />;
};

export default GoalsPage;
