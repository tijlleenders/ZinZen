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

  const isInPartnerMode = () => {
    return window.location.pathname.startsWith("/partners");
  };

  const disablePartnerTour = () => {
    if (partnerModeTour) setPartnerModeTour(false);
  };

  const enterPartnerMode = async () => {
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
    disablePartnerTour();
    navigate({ to: "/partners" });
  };

  const exitPartnerMode = () => {
    setIsFlipping(true);
    disablePartnerTour();
    navigate({ to: "/goals/$parentId", params: { parentId: "root" }, replace: true });
  };

  const togglePartnerMode = async () => {
    if (isInPartnerMode()) {
      exitPartnerMode();
    } else {
      await enterPartnerMode();
    }
  };

  return { togglePartnerMode };
};
