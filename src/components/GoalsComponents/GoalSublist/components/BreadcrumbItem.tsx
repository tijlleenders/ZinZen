import React from "react";
import "./BreadcrumbItem.scss";

interface BreadcrumbItemProps {
  color: string;
  title: string;
}

const BreadcrumbItem = ({ color, title }: BreadcrumbItemProps) => {
  return (
    <span
      className="breadcrumb-item fw-500"
      style={{
        border: `1px solid ${color}`,
        background: `${color}33`,
      }}
    >
      {title}
    </span>
  );
};

export default BreadcrumbItem;
