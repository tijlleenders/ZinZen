import React from "react";

const ModalActionButton = ({
  children,
  loading = false,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
  loading?: boolean;
}) => {
  return (
    <button
      type="button"
      className={`goal-action-archive shareOptions-btn ${loading ? "disabled" : ""}`}
      disabled={loading}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ModalActionButton;
