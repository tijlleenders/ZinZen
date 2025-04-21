import ContactItem from "@src/models/ContactItem";
import React, { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { getPartnerById } from "@src/api/ContactsAPI";
import { useQuery } from "react-query";
import { ActiveGoalProvider } from "./activeGoal-context";

type PartnerContext = {
  partner: ContactItem | undefined;
  setCurrentPartnerInLocalStorage: (partnerId: string) => void;
  isFetching: boolean;
  isSuccess: boolean;
  error: unknown;
};

const PartnerContext = createContext<PartnerContext | undefined>(undefined);

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
  const { partnerId: partnerIdFromUrl } = useParams();
  const cachedPartnerId = localStorage.getItem(LocalStorageKeys.CURRENT_PARTNER);
  const partnerId = partnerIdFromUrl || cachedPartnerId || "";

  const {
    isFetching,
    isSuccess,
    error,
    data: partner,
  } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartnerById(partnerId),
    enabled: !!partnerId,
  });

  const setCurrentPartnerInLocalStorage = (partnerIdToSet: string) => {
    localStorage.setItem(LocalStorageKeys.CURRENT_PARTNER, partnerIdToSet);
  };

  const value = useMemo(
    () => ({ partner, setCurrentPartnerInLocalStorage, isFetching, isSuccess, error }),
    [partner, isFetching, isSuccess, error],
  );

  useEffect(() => {
    if (partner?.id) {
      setCurrentPartnerInLocalStorage(partner.id);
    }
  }, [partner]);

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
