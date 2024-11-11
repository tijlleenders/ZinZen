import { useState, useEffect } from "react";

function useVirtualKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const initialHeight = useState(window.visualViewport?.height || 0)[0];
  const [currentHeight, setCurrentHeight] = useState(window.visualViewport?.height || 0);

  useEffect(() => {
    const onResize = () => {
      const newHeight = window.visualViewport?.height ?? 0;
      setCurrentHeight(newHeight);

      if (newHeight < initialHeight * 0.75) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [initialHeight, currentHeight]);

  return isKeyboardOpen;
}

export default useVirtualKeyboardOpen;
