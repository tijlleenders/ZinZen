import React from "react";

interface TriangleIconProps {
  fill: string;
  strokeWidth?: number | string; // Optional strokeWidth prop
  backgroundColor?: string; // Optional backgroundColor prop
}

const TriangleIcon = ({ fill, strokeWidth = 0.0000001, backgroundColor }: TriangleIconProps) => {
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
      {/* Background triangle */}
      <path
        d="M7.53 15.848L15.53 10.848C16.1567 10.4563 16.1567 9.54368 15.53 9.15201L7.53 4.15201C6.86395 3.73573 6 4.21458 6 5.00001L6 15C6 15.7854 6.86395 16.2643 7.53 15.848Z"
        fill={backgroundColor}
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
