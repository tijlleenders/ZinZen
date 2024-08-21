import { ILanguage } from "@src/Interfaces";
import { useEffect, useState } from "react";
import { useKeyPress } from "./useKeyPress";

export const useLanguageSelection = (languages: ILanguage[], handleClick: (langId: string) => void): number => {
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const upPress = useKeyPress("ArrowUp");
  const downPress = useKeyPress("ArrowDown");
  const enterPress = useKeyPress("Enter");

  useEffect(() => {
    if (downPress) {
      setFocusedIndex((prevIndex) => (prevIndex + 1) % languages.length);
    }
  }, [downPress]);

  useEffect(() => {
    if (upPress) {
      setFocusedIndex((prevIndex) => (prevIndex - 1 + languages.length) % languages.length);
    }
  }, [upPress]);

  useEffect(() => {
    if (enterPress) {
      const { langId } = languages[focusedIndex];
      handleClick(langId);
    }
  }, [enterPress]);

  return focusedIndex;
};

// import { ILanguage } from "@src/Interfaces";
// import { useEffect, useState } from "react";
// import { useKeyPress } from "./useKeyPress";

// export const useLanguageSelection = (languages: ILanguage[], handleClick: (langId: string) => void): number => {
//   const [focusedIndex, setFocusedIndex] = useState<number>(0);

//   useEffect(() => {
//     const handleKeydown = (event: KeyboardEvent) => {
//       if (event.key === "ArrowUp") {
//         setFocusedIndex((prevIndex) => (prevIndex - 1 + languages.length) % languages.length);
//       } else if (event.key === "ArrowDown") {
//         setFocusedIndex((prevIndex) => (prevIndex + 1) % languages.length);
//       } else if (event.key === "Enter") {
//         const { langId } = languages[focusedIndex];
//         handleClick(langId);
//       }
//     };

//     window.addEventListener("keydown", handleKeydown);

//     return () => window.removeEventListener("keydown", handleKeydown);
//   }, [languages, focusedIndex, handleClick]);

//   return focusedIndex;
// };
