import React, { ReactNode } from "react";
import FabButton from "./FabButton/FabButton";
import FabOptionsMenu from "./FabOptionsMenu/FabOptionsMenu";
import { FabMenuConfig } from "./FabOptionsMenu/FabOptionsMenu.types";

interface FabProps {
  icon: ReactNode;
  onClick: () => void;
  menu?: FabMenuConfig;
}

const GlobalFab: React.FC<FabProps> = ({ icon, onClick, menu }) => {
  const showMenu = menu?.show === true && (menu.options?.length ?? 0) > 0;

  if (showMenu) {
    return <FabOptionsMenu options={menu!.options} onClose={() => window.history.back()} />;
  }

  return <FabButton icon={icon} onClick={onClick} onLongPress={menu?.onLongPress} />;
};

export default GlobalFab;
