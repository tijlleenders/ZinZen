import { getAllContacts } from "@src/api/ContactsAPI";
import { CONTACT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";
import ContactItem from "@src/models/ContactItem";
import { QueryResult } from "@src/hooks/types";

export const useGetAllContacts = (): QueryResult<ContactItem[]> => {
  const { data, isLoading } = useQuery({
    queryKey: CONTACT_QUERY_KEYS.lists(),
    queryFn: () => getAllContacts(),
  });

  return { data, isLoading };
};
