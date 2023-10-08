import { useRecoilValue } from "recoil";
import React, { useEffect, useState } from "react";

import { getAllContacts } from "@src/api/ContactsAPI";
import { displayPartnerMode } from "@src/store";
import { displayParticipants } from "@src/store/GoalsState";

import ContactItem from "@src/models/ContactItem";
import Participants from "@components/GoalsComponents/Participants";
import ParticipantsNavbar from "@components/ParticipantsNavbar";
import GoalLocStateHandler from "@src/helpers/GoalLocStateHandler";

import { MyGoals } from "./MyGoals";
import PartnerGoals from "./PartnerGoals";
import "./GoalsPage.scss";

const GoalsPage = () => {
  const showPartnerMode = useRecoilValue(displayPartnerMode);
  const showParticipants = useRecoilValue(displayParticipants);

  const [activePartner, setActivePartner] = useState<ContactItem | null>(null);
  const [partnersList, setPartnersList] = useState<ContactItem[]>([]);

  useEffect(() => {
    const switchMode = async () => {
      const list = await getAllContacts();
      setActivePartner(list[0]);
      setPartnersList([...list]);
    };
    switchMode();
  }, [showPartnerMode]);

  return (
    <>
      <GoalLocStateHandler />
      {showParticipants && <Participants goalId={showParticipants} />}
      {showPartnerMode && activePartner ? (
        <>
          <PartnerGoals partner={activePartner} />
          <ParticipantsNavbar list={partnersList} activePartner={activePartner} setActivePartner={setActivePartner} />
        </>
      ) : (
        <MyGoals />
      )}
    </>
  );
};

export default GoalsPage;
