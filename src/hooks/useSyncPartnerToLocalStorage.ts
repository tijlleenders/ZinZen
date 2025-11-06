import { useEffect } from "react";
import ContactItem from "@src/models/ContactItem";
import { setCurrentPartnerInLocalStorage } from "@src/utils/partnerStorage";

/**
 * Hook to automatically sync partner data to localStorage when it changes
 */
export const useSyncPartnerToLocalStorage = (partner: ContactItem | undefined): void => {
  useEffect(() => {
    if (partner?.id) {
      setCurrentPartnerInLocalStorage(partner.id);
    }
  }, [partner]);
};
