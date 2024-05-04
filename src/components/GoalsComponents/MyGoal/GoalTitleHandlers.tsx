import { summarizeUrl } from "@src/utils/patterns";
import React from "react";

export const UrlHandler = ({ url }: { url: string }) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      window.open(url, "_blank");
    }
  };

  const handleClick = () => {
    window.open(url, "_blank");
  };

  return (
    <span
      role="link"
      tabIndex={0}
      style={{ cursor: "pointer", textDecoration: "underline" }}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      aria-label={`Open ${summarizeUrl(url)}`}
    >
      {summarizeUrl(url)}
    </span>
  );
};

export const TelHandler = ({ telUrl }: { telUrl: string }) => {
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      window.location.href = telUrl;
    }
  };

  const handleClick = () => {
    window.location.href = telUrl;
  };

  return (
    <span
      role="button"
      tabIndex={0}
      style={{ cursor: "pointer", textDecoration: "underline" }}
      onClick={handleClick}
      onKeyDown={handleKeyPress}
      aria-label={`Call ${telUrl.split(":")[1]}`}
    >
      {telUrl}
    </span>
  );
};
