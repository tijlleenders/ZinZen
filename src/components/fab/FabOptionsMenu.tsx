import React, { useCallback } from "react";
import Backdrop from "@src/common/Backdrop";
import FabOption from "./FabOption";

export interface FabOption {
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

interface FabOptionsMenuProps {
  options: FabOption[];
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
        const bottom =
          options.length === 1
            ? OPTION_BOTTOM_POSITIONS.TOP
            : index === 0
              ? OPTION_BOTTOM_POSITIONS.TOP
              : OPTION_BOTTOM_POSITIONS.BOTTOM;
        return (
          <FabOption key={option.label} handleClick={option.onClick} bottom={bottom} disabled={option.disabled}>
            {option.label}
          </FabOption>
        );
      })}
    </>
  );
};

export default FabOptionsMenu;
