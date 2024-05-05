import { useState, useEffect } from "react";

function useVirtualKeyboardOpen() {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const initialHeight = useState(window.visualViewport?.height || 0)[0];

  useEffect(() => {
    const onResize = () => {
      const currentHeight = window.visualViewport?.height || 0;
      if (currentHeight < initialHeight * 0.75) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, [initialHeight]);

  return isKeyboardOpen;
}
export default useVirtualKeyboardOpen;
