import { useEffect, useState, useCallback } from "react";

export const useKeyPress = (targetKey: string) => {
  const [keyPressed, setKeyPressed] = useState(false);

  const keyHandler = useCallback(
    (event: KeyboardEvent) => {
      event.stopPropagation();
      if (event.key === targetKey || (targetKey === "Space" && event.key === " ")) {
        setKeyPressed(event.type === "keydown");
      }
    },
    [targetKey],
  );

  useEffect(() => {
    window.addEventListener("keydown", keyHandler);
    window.addEventListener("keyup", keyHandler);

    return () => {
      window.removeEventListener("keydown", keyHandler);
      window.removeEventListener("keyup", keyHandler);
    };
  }, [keyHandler]);

  return keyPressed;
};
