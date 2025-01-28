import { getAllContacts, getPartnerById } from "@src/api/ContactsAPI";
import ContactItem from "@src/models/ContactItem";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { ActiveGoalProvider } from "./activeGoal-context";

type PartnerContext = {
  partner: ContactItem | undefined;
  partnersList: ContactItem[];
};

export const PartnerContext = createContext<PartnerContext | undefined>(undefined);

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
  const { partnerId } = useParams();
  const [partner, setPartner] = useState<ContactItem>();
  const [partnersList, setPartnersList] = useState<ContactItem[]>([]);
  const isPartnerModeActive = !!partnerId;

  useEffect(() => {
    async function initPartner() {
      if (partnerId) {
        const doc = await getPartnerById(partnerId);
        setPartner(doc);
      } else {
        setPartner(undefined);
      }
    }
    initPartner();
  }, [isPartnerModeActive, partnerId]);

  useEffect(() => {
    async function initPartnersList() {
      const docs = await getAllContacts();
      setPartnersList(docs);
      if (!partnerId && docs.length) {
        setPartner(docs[0]);
      }
    }
    initPartnersList();
  }, [partnerId]);

  const value = useMemo(() => ({ partner, partnersList }), [partner, partnersList]);

  return (
    <ActiveGoalProvider>
      <PartnerContext.Provider value={value}>{children}</PartnerContext.Provider>
    </ActiveGoalProvider>
  );
};

export const usePartnerContext = () => {
  const context = useContext(PartnerContext);
  if (!context) {
    throw new Error("usePartnerContext must be used within a PartnerProvider");
  }
  return context;
};
