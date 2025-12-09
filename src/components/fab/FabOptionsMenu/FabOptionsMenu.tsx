import React, { useCallback } from "react";
import Backdrop from "@src/common/Backdrop";
import { FabMenuOption } from "./FabOptionsMenu.types";
import "./FabOptionsMenu.scss";
import FabOption from "../FabOption/FabOption";

interface FabOptionsMenuProps {
  options: FabMenuOption[];
  onClose: () => void;
}

const OPTION_BOTTOM_POSITIONS = {
  TOP: 144,
  BOTTOM: 74,
} as const;

const FabOptionsMenu: React.FC<FabOptionsMenuProps> = ({ options, onClose }) => {
  const handleBackdropClick = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <>
      <Backdrop opacity={0.5} onClick={handleBackdropClick} />
      {options.map((option, index) => {
        // Position calculation:
        // - First option (index 0) always goes at TOP position
        // - Additional options go at BOTTOM position
        // Note: When there's only 1 option, index is 0, so it uses TOP position
        const bottom = index === 0 ? OPTION_BOTTOM_POSITIONS.TOP : OPTION_BOTTOM_POSITIONS.BOTTOM;

        return (
          <FabOption
            key={option.label}
            text={option.label}
            handleClick={option.onClick}
            bottom={bottom}
            disabled={option.disabled}
          />
        );
      })}
    </>
  );
};

export default FabOptionsMenu;
