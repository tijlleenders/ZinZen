import React from "react";

interface TriangleIconProps {
  fill: string;
  strokeWidth?: number | string; // Optional strokeWidth prop
  gradientId?: string; // Optional gradientId prop for specifying a gradient
  backgroundColor?: string; // Optional backgroundColor prop for gradient CSS string
}

const TriangleIcon = ({
  fill,
  strokeWidth = 0.0000000001,
  gradientId = "dynamicGradient",
  backgroundColor = "transparent",
}: TriangleIconProps) => {
  const isGradient = backgroundColor.startsWith("radial-gradient");

  return (
    <svg
      style={{ marginLeft: -16, marginRight: -16 }}
      width="56px"
      height="56px"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={fill}
      strokeWidth={strokeWidth}
    >
      <defs>
        {isGradient && (
          <radialGradient id={gradientId} cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="89.585%" stopColor="#87FF2A33" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        )}
      </defs>
      <path
        d="M7.53 15.848L15.53 10.848C16.1567 10.4563 16.1567 9.54368 15.53 9.15201L7.53 4.15201C6.86395 3.73573 6 4.21458 6 5.00001L6 15C6 15.7854 6.86395 16.2643 7.53 15.848Z"
        fill={isGradient ? `url(#${gradientId})` : backgroundColor}
      />
      <g id="SVGRepo_iconCarrier">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M7.53 15.848L15.53 10.848C16.1567 10.4563 16.1567 9.54368 15.53 9.15201L7.53 4.15201C6.86395 3.73573 6 4.21458 6 5.00001L6 15C6 15.7854 6.86395 16.2643 7.53 15.848ZM8 13.1958L8 6.80426L13.1132 10L8 13.1958Z"
          fill={fill}
        />
      </g>
    </svg>
  );
};

export default TriangleIcon;
