import React from "react";

interface TriangleIconProps {
  fill: string;
  strokeWidth?: number | string; // Optional strokeWidth prop
  size: number; // Size of the icon
  backgroundColor?: string; // Optional backgroundColor prop for gradient CSS string
}

const TriangleIcon: React.FC<TriangleIconProps> = ({ fill, strokeWidth, size, backgroundColor, strokeColor }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} fill={fill} opacity={50} viewBox="0 0 96 99">
      <g clipPath="url(#clip0_3_3406)">
        <path
          fillOpacity={0.2}
          fill={fill}
          stroke={strokeColor}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={strokeWidth}
          d="M22.108 10.17C13.449 5.562 3 11.837 3 21.646v55.708c0 9.81 10.449 16.084 19.108 11.476L74.44 60.976c9.189-4.891 9.189-18.06 0-22.952L22.108 10.17z"
        />
      </g>
      <defs>
        <clipPath id="clip0_3_3406">
          <path fill={fill} d="M0 0H99V96H0z" transform="rotate(90 48 48)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default TriangleIcon;
