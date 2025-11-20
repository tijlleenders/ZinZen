import { useNavigate } from "@tanstack/react-router";
import { useRecoilState, useSetRecoilState } from "recoil";

import { getAllContacts } from "@src/api/ContactsAPI";
import { displayToast, flipAnimationState } from "@src/store";
import { displayPartnerModeTour } from "@src/store/TourState";

export const useHeaderLogoHandlers = () => {
  const navigate = useNavigate();
  const setShowToast = useSetRecoilState(displayToast);
  const [partnerModeTour, setPartnerModeTour] = useRecoilState(displayPartnerModeTour);
  const setIsFlipping = useSetRecoilState(flipAnimationState);

  const handleEnterPartnerMode = async () => {
    setIsFlipping(true);
    const partners = await getAllContacts();
    if (partners.length === 0) {
      setShowToast({
        open: true,
        message: "Do you have a partner?",
        extra: "Try sharing a goal privately. Click on a goal circle to start.",
      });
      return;
    }
    if (partnerModeTour) {
      setPartnerModeTour(false);
    }
    navigate({ to: "/partners" });
  };

  const handleExitPartnerMode = async () => {
    setIsFlipping(true);
    if (partnerModeTour) {
      setPartnerModeTour(false);
    }
    navigate({ to: "/goals/$parentId", params: { parentId: "root" }, replace: true });
  };

  return { handleEnterPartnerMode, handleExitPartnerMode };
};
