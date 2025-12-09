import { displayToast } from "@src/store";
import { removeBackTicks } from "@src/utils/patterns";
import { useSetRecoilState } from "recoil";

export const useCopyCode = () => {
  const showToast = useSetRecoilState(displayToast);

  const copyCode = (title: string) => {
    const cleanTitle = removeBackTicks(title);

    navigator.clipboard.writeText(cleanTitle);
    const MAX_LENGTH = 15;
    const displayTitle = cleanTitle.length > MAX_LENGTH ? `${cleanTitle.slice(0, MAX_LENGTH)}...` : cleanTitle;

    showToast({
      open: true,
      message: `Copied: ${displayTitle}`,
      extra: "",
    });
  };

  return copyCode;
};
