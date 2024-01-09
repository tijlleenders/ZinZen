import { checkAndUpdateRelationshipStatus } from "@src/api/ContactsAPI";
import { useEffect, useState } from "react";

const useGetRelationshipStatus = (relId: string) => {
  const [loading, setLoading] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const status = await checkAndUpdateRelationshipStatus(relId);
      setRelationshipStatus(status);
      setLoading(false);
    };

    fetchData();
  }, [relId]);

  return { relationshipStatus, loading };
};

export default useGetRelationshipStatus;
