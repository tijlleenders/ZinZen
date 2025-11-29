import React, { ReactNode } from "react";
import useLongPress from "@src/hooks/useLongPress";
import "./FabButton.scss";

interface FabButtonProps {
  icon: ReactNode;
  onClick: () => void;
  onLongPress?: () => void;
  longPressTime?: number;
}

const FabButton: React.FC<FabButtonProps> = ({ icon, onClick, onLongPress, longPressTime = 200 }) => {
  const { handlers } = useLongPress({
    onLongPress,
    onClick,
    longPressTime,
  });

  const { onClick: handleClick, onMouseDown, onMouseUp, onTouchStart, onTouchEnd } = handlers;

  return (
    <button
      type="button"
      className="fab-button"
      onClick={handleClick}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      {icon}
    </button>
  );
};

export default FabButton;
