import { useRecoilValue, useSetRecoilState } from "recoil";
import React, { useEffect, useState } from "react";

import { getAllContacts } from "@src/api/ContactsAPI";
import { displayPartner, displayPartnerMode } from "@src/store";
import { displayParticipants } from "@src/store/GoalsState";

import { useLocation, useNavigate } from "react-router-dom";
import ContactItem from "@src/models/ContactItem";
import Participants from "@components/GoalsComponents/Participants";
import ParticipantsNavbar from "@components/ParticipantsNavbar";
import GoalLocStateHandler from "@src/helpers/GoalLocStateHandler";
import { getAllImpossibleGoals } from "@src/api/ImpossibleGoalsApi";
import { impossibleGoalsList } from "@src/store/ImpossibleGoalState";

import { MyGoals } from "./MyGoals";
import PartnerGoals from "./PartnerGoals";
import "./GoalsPage.scss";

const GoalsPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const showPartnerMode = useRecoilValue(displayPartnerMode);
  const showParticipants = useRecoilValue(displayParticipants);
  const setImpossibleGoals = useSetRecoilState(impossibleGoalsList);

  const activePartner = useRecoilValue(displayPartner);
  const [partnersList, setPartnersList] = useState<ContactItem[]>([]);

  const handleActivePartner = (partner: ContactItem) => {
    navigate("/MyGoals", { state: { ...state, displayPartner: partner }, replace: true });
  };

  useEffect(() => {
    const switchMode = async () => {
      const list = await getAllContacts();
      setPartnersList([...list]);
    };
    switchMode();
  }, [showPartnerMode]);

  useEffect(() => {
    getAllImpossibleGoals().then((goals) => {
      setImpossibleGoals(goals);
    });
  }, []);

  return (
    <>
      <GoalLocStateHandler />
      {showParticipants && <Participants goalId={showParticipants} />}
      {showPartnerMode && activePartner ? (
        <>
          <PartnerGoals partner={activePartner} />
          <ParticipantsNavbar
            list={partnersList}
            activePartner={activePartner}
            handleActivePartner={handleActivePartner}
          />
        </>
      ) : (
        <MyGoals />
      )}
    </>
  );
};

export default GoalsPage;
