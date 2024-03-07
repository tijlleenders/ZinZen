import React from "react";
import { shareInvitation } from "@src/assets";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { displayToast, darkModeState } from "@src/store";
import useGetRelationshipStatus from "@src/hooks/useGetRelationshipStatus";

const InvitationStatus = ({ relId }: { relId: string }) => {
  const setShowToast = useSetRecoilState(displayToast);
  const darkModeStatus = useRecoilValue(darkModeState);
  const { relationshipStatus, type, partnerName, loading } = useGetRelationshipStatus(relId);

  const handleSendInvitation = async () => {
    navigator.clipboard.writeText(`${window.location.origin}/invite/${relId}`);
    setShowToast({
      open: true,
      message: "Link copied to clipboard",
      extra: "Once your partner accepts the invitation link - your goals will be shared automatically",
    });
  };

  if (loading) return null;

  let message;
  if (relationshipStatus && type === "receiver") {
    message = `This is where you can see all the goals shared by ${partnerName}. At the moment there are no goals shared with you yet by ${partnerName}.`;
  } else if (!relationshipStatus && type === "receiver") {
    message = "Your partner has not accepted the sharing request yet. Click the button below to share again.";
  } else {
    message = "Your partner has accepted the sharing request but has not shared anything with you.";
  }

  return (
    <div style={{ textAlign: "center", margin: "0 20px", fontWeight: 400, fontSize: 18 }}>
      <p>{message}</p>
      {!relationshipStatus && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button
            type="button"
            className={`default-btn${darkModeStatus ? "-dark" : ""}`}
            onClick={handleSendInvitation}
          >
            <img alt="add contact" className="theme-icon" src={shareInvitation} />
            <span>Share invitation</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default InvitationStatus;
