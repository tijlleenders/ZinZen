import { useRef, useState, useCallback } from "react";

interface UseLongPressOptions {
  onLongPress?: (e: React.MouseEvent | React.TouchEvent) => void;
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void;
  longPressTime?: number;
}

export default function useLongPress({ onLongPress, onClick, longPressTime = 500 }: UseLongPressOptions = {}) {
  const [action, setAction] = useState("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef<boolean>(false);
  const eventRef = useRef<React.MouseEvent | React.TouchEvent | null>(null);

  const startPressTimer = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      isLongPress.current = false;
      eventRef.current = e;
      timerRef.current = setTimeout(() => {
        isLongPress.current = true;
        setAction("longpress");
        onLongPress?.(eventRef.current!);
      }, longPressTime);
    },
    [longPressTime, onLongPress],
  );

  const handleOnClick = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      e.stopPropagation();
      if (isLongPress.current) {
        return;
      }
      setAction("click");
      onClick?.(e);
    },
    [onClick],
  );

  const handleOnMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      startPressTimer(e);
    },
    [startPressTimer],
  );

  const handleOnMouseUp = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    clearTimeout(timerRef.current!);
  }, []);

  const handleOnTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      startPressTimer(e);
    },
    [startPressTimer],
  );

  const handleOnTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      if (action === "longpress") return;
      clearTimeout(timerRef.current!);
    },
    [action],
  );

  return {
    action,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
  };
}
