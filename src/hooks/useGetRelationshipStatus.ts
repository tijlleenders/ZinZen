import { getContactByRelId } from "@src/api/ContactsAPI";
import { displayToast } from "@src/store";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const useGetRelationshipStatus = (relId: string) => {
  const [loading, setLoading] = useState(false);
  const [relationshipStatus, setRelationshipStatus] = useState(false);
  const [type, setType] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const displayToastValue = useRecoilValue(displayToast);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const contact = await getContactByRelId(relId);
      const accepted = contact?.accepted;
      if (contact?.name) {
        setPartnerName(contact.name);
      }
      if (contact?.type) {
        setType(contact.type);
      }

      if (accepted !== undefined) {
        setRelationshipStatus(accepted);
      }
      setLoading(false);
    };

    fetchData();
  }, [displayToastValue, relId]);

  return { relationshipStatus, partnerName, type, loading };
};

export default useGetRelationshipStatus;
