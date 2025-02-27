import { getAllContacts } from "@src/api/ContactsAPI";
import { useQuery } from "react-query";

export const useGetAllContacts = () => {
  const {
    data: contacts,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => getAllContacts(),
  });

  return { contacts, isLoading, isError, error };
};
