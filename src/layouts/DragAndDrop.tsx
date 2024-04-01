import React, { ReactNode } from "react";

interface DadProps {
  index: number;
  dragging: boolean;
  children: ReactNode;
  thisItem: boolean;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  handleDragEnter: (index: number) => void;
  handleDragEnd: () => void;
}

const DragAndDrop: React.FC<DadProps> = ({
  index,
  dragging,
  children,
  thisItem,
  handleDragStart,
  handleDragEnter,
  handleDragEnd,
}) => (
  <div
    key={index}
    draggable={!dragging}
    onDragStart={(e) => handleDragStart(e, index)}
    onDragEnter={() => handleDragEnter(index)}
    onDragEnd={handleDragEnd}
    style={{
      opacity: dragging && thisItem ? 0.8 : 1,
      cursor: "move",
      transition: "opacity 0.8s ease",
      background: dragging && thisItem ? "var(--selection-color)" : "transparent",
    }}
  >
    {children}
  </div>
);

export default DragAndDrop;
