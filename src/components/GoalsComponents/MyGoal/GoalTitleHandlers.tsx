import React, { useCallback } from "react";
import { summarizeUrl } from "@src/utils/patterns";

type Action = (e: React.MouseEvent | React.KeyboardEvent) => void;

const useClickHandler = (action: Action, ariaLabelPrefix: string) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      action(e);
    },
    [action],
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Enter" || event.key === " ") {
        event.stopPropagation();
        action(event);
      }
    },
    [action],
  );
  const ariaLabel = `${ariaLabelPrefix}`;
  return { handleClick, handleKeyPress, ariaLabel };
};

const useHandler = (action: Action, ariaLabelPrefix: string, displayText: string) => {
  const { handleClick, handleKeyPress, ariaLabel } = useClickHandler(action, `${ariaLabelPrefix} ${displayText}`);

  const HandlerComponent = () => (
    <button
      type="button"
      role={ariaLabelPrefix === "Call" ? "button" : "link"}
      tabIndex={0}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        textDecoration: "underline",
        padding: 0,
        display: "inline-block",
      }}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      aria-label={ariaLabel}
    >
      {displayText}
    </button>
  );

  return HandlerComponent;
};

// Hook for URL handling
export const useUrlHandler = (url: string) => {
  const action = () => {
    window.open(url, "_blank");
  };
  const displayText = summarizeUrl(url);
  return useHandler(action, "Open", displayText);
};

// Hook for Tel handling
export const useTelHandler = (telUrl: string) => {
  const action = () => {
    window.location.href = telUrl;
  };
  const displayText = telUrl.split(":")[1];
  return useHandler(action, "Call", displayText);
};
