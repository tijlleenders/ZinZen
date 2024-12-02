import React from "react";

interface DefaultInputProps {
  customStyle?: React.CSSProperties;
  width?: number | string;
  textAlign?: "left" | "center" | "right";
  type?: string;
  value?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const DefaultInput: React.FC<DefaultInputProps> = ({
  customStyle,
  width,
  textAlign = "left",
  type,
  value,
  onChange,
  placeholder,
}) => {
  const baseStyle: React.CSSProperties = {
    textAlign,
    width: width || "100%",
    boxShadow: "var(--shadow)",
    ...customStyle,
  };

  return (
    <input
      className="default-input"
      placeholder={placeholder}
      style={baseStyle}
      type={type}
      value={value}
      onChange={onChange}
    />
  );
};

export default DefaultInput;
