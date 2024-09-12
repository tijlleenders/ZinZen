import { ILanguage } from "@src/Interfaces";
import { useEffect, useState } from "react";

export const useLanguageSelection = (languages: ILanguage[], handleClick: (langId: string) => void): number => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowUp") {
        setFocusedIndex((prevIndex) => (prevIndex - 1 + languages.length) % languages.length);
      } else if (event.key === "ArrowDown") {
        setFocusedIndex((prevIndex) => (prevIndex + 1) % languages.length);
      } else if (event.key === "Enter") {
        const { langId } = languages[focusedIndex];
        handleClick(langId);
      }
    };

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [languages, focusedIndex, handleClick]);

  return focusedIndex;
};
