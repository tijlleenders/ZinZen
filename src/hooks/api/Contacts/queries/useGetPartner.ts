import { getPartnerById } from "@src/api/ContactsAPI";
import { CONTACT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import { useParams } from "@tanstack/react-router";
import ContactItem from "@src/models/ContactItem";
import { QueryResult } from "@src/hooks/types";
import { getCurrentPartnerFromLocalStorage } from "@src/utils/partnerStorage";

export const useGetPartner = (): QueryResult<ContactItem> => {
  const { partnerId: partnerIdFromUrl } = useParams({ strict: false }) as { partnerId: string };
  const cachedPartnerId = getCurrentPartnerFromLocalStorage();
  const partnerId = partnerIdFromUrl || cachedPartnerId || "";

  const { data, isLoading } = useQuery({
    queryKey: CONTACT_QUERY_KEYS.detail(partnerId),
    queryFn: () => getPartnerById(partnerId),
    enabled: !!partnerId,
  });

  return { data, isLoading };
};
