import { getPartnerById } from "@src/api/ContactsAPI";
import { useQuery } from "react-query";

export const useGetPartnerById = (partnerId: string) => {
  const {
    isFetching,
    isSuccess,
    error,
    data: contact,
  } = useQuery({
    queryKey: ["partner", partnerId],
    queryFn: () => getPartnerById(partnerId),
  });

  return { isFetching, isSuccess, error, contact };
};
