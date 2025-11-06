import { getPartnerById } from "@src/api/ContactsAPI";
import { CONTACT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import ContactItem from "@src/models/ContactItem";
import { QueryResult } from "@src/hooks/types";

export const useGetContactByPartnerId = (partnerId: string): QueryResult<ContactItem> => {
  const { data, isLoading } = useQuery({
    queryKey: CONTACT_QUERY_KEYS.detail(partnerId),
    queryFn: () => getPartnerById(partnerId),
    enabled: !!partnerId,
  });

  return { data, isLoading };
};
