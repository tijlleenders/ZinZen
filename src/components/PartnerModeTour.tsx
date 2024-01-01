import React from "react";
import { Tour, TourProps } from "antd";
import { useRecoilState } from "recoil";
import { displayPartnerModeTour } from "@src/store";

interface PartnerModeTourProps {
  refTarget: React.MutableRefObject<null>;
}

const PartnerModeTour: React.FC<PartnerModeTourProps> = ({ refTarget }) => {
  const [partnerModeTour, setPartnerModeTour] = useRecoilState(displayPartnerModeTour);

  const steps: TourProps["steps"] = [
    {
      title: "Switch to partner mode",
      description: "You can see your partner's shared goals here.",
      target: () => refTarget.current,
    },
  ];

  return <Tour open={partnerModeTour} steps={steps} onClose={() => setPartnerModeTour(false)} />;
};

export default PartnerModeTour;
