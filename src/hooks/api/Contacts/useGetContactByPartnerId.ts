import { getPartnerById } from "@src/api/ContactsAPI";
import { useQuery } from "react-query";

export const useGetContactByPartnerId = (partnerId: string) => {
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

  return { partner, isFetching, isSuccess, error };
};
