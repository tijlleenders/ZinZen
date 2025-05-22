import { getAllContacts } from "@src/api/ContactsAPI";
import { CONTACT_QUERY_KEYS } from "@src/factories/queryKeyFactory";
import { useQuery } from "react-query";

export const useGetAllContacts = () => {
  const {
    data: contacts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: CONTACT_QUERY_KEYS.lists(),
    queryFn: () => getAllContacts(),
  });

  return { contacts, isLoading, isError, error };
};
