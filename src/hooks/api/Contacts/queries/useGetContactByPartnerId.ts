import { getPartnerById } from "@src/api/ContactsAPI";
import { CONTACT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";

export const useGetContactByPartnerId = (partnerId: string) => {
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

  return { partner, isFetching, isSuccess, error };
};
