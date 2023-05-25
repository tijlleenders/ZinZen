import React, { ReactNode } from "react";

interface DadProps {
  index: number,
  dragging: boolean,
  children: ReactNode,
  thisItem: boolean,
  handleDragStart: (e: any, index: number) => void
  handleDragEnter: (index: number) => void,
  handleDragEnd: () => void
}

const DragAndDrop : React.FC<DadProps> = ({
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
      opacity: dragging && thisItem ? 0.5 : 1,
      cursor: "move",
      transition: "opacity 0.3s ease",
    }}
  >
    {children}
  </div>
);

export default DragAndDrop;
