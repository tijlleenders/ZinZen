import React from "react";
import { shareInvitation } from "@src/assets";
import { useSetRecoilState } from "recoil";
import { displayToast } from "@src/store";
import useGetRelationshipStatus from "@src/hooks/useGetRelationshipStatus";
import DefaultButton from "@src/common/DefaultButton";

const InvitationStatus = ({ relId }: { relId: string }) => {
  const setShowToast = useSetRecoilState(displayToast);
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
    <div
      className="fw-400 d-flex f-col text-lg gap-16 text-center"
      style={{
        margin: "0 20px",
      }}
    >
      <p>{message}</p>
      {!relationshipStatus && (
        <div className="place-middle">
          <DefaultButton onClick={handleSendInvitation}>
            <img alt="add contact" className="theme-icon" src={shareInvitation} />
            <span>Share invitation</span>
          </DefaultButton>
        </div>
      )}
    </div>
  );
};

export default InvitationStatus;
