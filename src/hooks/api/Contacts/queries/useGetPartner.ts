import { getPartnerById } from "@src/api/ContactsAPI";
import { CONTACT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import { useQuery } from "react-query";
import { useParams } from "@tanstack/react-router";
import { useEffect } from "react";

export const useGetPartner = () => {
  const { partnerId: partnerIdFromUrl } = useParams({ strict: false });
  const cachedPartnerId = localStorage.getItem(LocalStorageKeys.CURRENT_PARTNER);
  const partnerId = partnerIdFromUrl || cachedPartnerId || "";

  const {
    isFetching,
    isSuccess,
    error,
    data: partner,
  } = useQuery({
    queryKey: CONTACT_QUERY_KEYS.detail(partnerId),
    queryFn: () => getPartnerById(partnerId),
    enabled: !!partnerId,
  });

  const setCurrentPartnerInLocalStorage = (partnerIdToSet: string) => {
    localStorage.setItem(LocalStorageKeys.CURRENT_PARTNER, partnerIdToSet);
  };

  useEffect(() => {
    if (partner?.id) {
      setCurrentPartnerInLocalStorage(partner.id);
    }
  }, [partner]);

  return { partner, setCurrentPartnerInLocalStorage, isFetching, isSuccess, error };
};
