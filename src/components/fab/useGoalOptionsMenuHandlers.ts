import { useCallback } from "react";

export const useGoalOptionsMenuHandlers = () => {
  const handleCloseMenu = useCallback(() => {
    window.history.back();
  }, []);

  const handleGoalFabLongPress = useCallback(
    (parentId: string, partnerId: string = "") => {
      if (isPartner) {
        navigate({
          to: `/partners/${partnerId}/goals/${parentId}`,
          search: { addOptions: true },
          state: (state) => ({ ...state }),
        });
      } else {
        navigate({
          to: `/goals/${parentId}`,
          search: { addOptions: true },
          state: (state) => ({ ...state }),
        });
      }
    },
    [navigate],
  );

  return { handleCloseMenu };
};
