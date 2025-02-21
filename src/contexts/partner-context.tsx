import { getAllContacts, getPartnerById } from "@src/api/ContactsAPI";
import ContactItem from "@src/models/ContactItem";
import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { lastAction } from "@src/store";
import { useRecoilValue } from "recoil";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { ActiveGoalProvider } from "./activeGoal-context";

type PartnerContext = {
  partner: ContactItem | undefined;
  partnersList: ContactItem[];
  setCurrentPartner: (partnerId: string) => void;
};

export const PartnerContext = createContext<PartnerContext | undefined>(undefined);

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
  const { partnerId } = useParams();
  const [partner, setPartner] = useState<ContactItem>();
  const [partnersList, setPartnersList] = useState<ContactItem[]>([]);
  const isPartnerModeActive = !!partnerId;
  const action = useRecoilValue(lastAction);

  const setCurrentPartner = (partnerIdToSet: string) => {
    localStorage.setItem(LocalStorageKeys.CURRENT_PARTNER, partnerIdToSet);
  };

  useEffect(() => {
    const storedPartnerId = localStorage.getItem(LocalStorageKeys.CURRENT_PARTNER);
    const idToUse = partnerId || storedPartnerId;

    if (idToUse) {
      getPartnerById(idToUse).then((doc) => {
        setPartner(doc);
      });
    } else {
      setPartner(undefined);
    }
  }, [isPartnerModeActive, partnerId]);

  useEffect(() => {
    getAllContacts().then((docs) => {
      setPartnersList([...docs]);
      if (docs.length) {
        const storedPartnerId = localStorage.getItem(LocalStorageKeys.CURRENT_PARTNER);
        const defaultPartner = storedPartnerId ? docs.find((doc) => doc.id === storedPartnerId) : docs[0];
        setPartner(defaultPartner);
      }
    });
  }, [action]);

  const value = useMemo(() => ({ partner, partnersList, setCurrentPartner }), [partner, partnersList]);

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
