import React from "react";
import { Tour, TourProps } from "antd";
import { useRecoilState } from "recoil";
import { displayPartnerModeTour } from "@src/store/TourState";

interface PartnerModeTourProps {
  refTarget: React.MutableRefObject<null>;
}

const PartnerModeTour: React.FC<PartnerModeTourProps> = ({ refTarget }) => {
  const [partnerModeTour, setPartnerModeTour] = useRecoilState(displayPartnerModeTour);

  const steps: TourProps["steps"] = [
    {
      title: "See your partner's goals here.",
      target: () => refTarget.current,
      nextButtonProps: {
        children: "Close",
      },
    },
  ];

  return (
    <Tour placement="bottomRight" open={partnerModeTour} steps={steps} onClose={() => setPartnerModeTour(false)} />
  );
};

export default PartnerModeTour;
