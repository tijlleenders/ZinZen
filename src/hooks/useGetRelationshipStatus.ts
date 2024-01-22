import { getContactByRelId } from "@src/api/ContactsAPI";
import { displayToast } from "@src/store";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const useGetRelationshipStatus = (relId: string) => {
  const [loading, setLoading] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState(false);
  const displayToastValue = useRecoilValue(displayToast);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const status = await getContactByRelId(relId);
      if (status?.accepted !== undefined) {
        setRelationshipStatus(status.accepted);
      }
      setLoading(false);
    };

    fetchData();
  }, [displayToastValue, relId]);

  return { relationshipStatus, loading };
};

export default useGetRelationshipStatus;
