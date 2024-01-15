import { getContactByRelId } from "@src/api/ContactsAPI";
import { useEffect, useState } from "react";

const useGetRelationshipStatus = (relId: string) => {
  const [loading, setLoading] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState(false);

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
  }, [relId]);

  return { relationshipStatus, loading };
};

export default useGetRelationshipStatus;
