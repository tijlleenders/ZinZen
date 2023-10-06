import { useRecoilValue } from "recoil";
import React, { useEffect, useState } from "react";

import { PartnerItem } from "@src/models/PartnerItem";
import { getAllContacts } from "@src/api/ContactsAPI";
import { getPartnerByRelId } from "@src/api/PartnerAPI";
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

  const [activePartner, setActivePartner] = useState<string>("");
  const [partner, setPartner] = useState<PartnerItem | null>(null);
  const [partnersList, setPartnersList] = useState<ContactItem[]>([]);

  const getPartnerDetails = async () => {
    let activeRelId;
    if (partnersList.length > 0) {
      activeRelId = partnersList[0].relId;
    } else {
      const list = await getAllContacts();
      activeRelId = list[0].relId;
      setPartnersList([...list]);
    }
    setActivePartner(activeRelId);
    setPartner(await getPartnerByRelId(activeRelId));
  };

  useEffect(() => {
    getPartnerDetails();
  }, [showPartnerMode, activePartner]);

  return (
    <>
      <GoalLocStateHandler />
      {showParticipants && <Participants list={showParticipants} />}
      {showPartnerMode && partner ? (
        <>
          <PartnerGoals partner={partner} refreshGoals={getPartnerDetails} />
          <ParticipantsNavbar list={partnersList} activePartner={activePartner} setActivePartner={setActivePartner} />
        </>
      ) : (
        <MyGoals />
      )}
    </>
  );
};

export default GoalsPage;
