import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";

import { ILocationState } from "@src/Interfaces";
import { backupRestoreModal } from "@src/store";
import { themeSelectionMode } from "@src/store/ThemeState";

function useGlobalStore() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openBackupModal, setBackupRestoreModal] = useRecoilState(backupRestoreModal);
  const [themeSelection, setThemeSelection] = useRecoilState(themeSelectionMode);

  const handleLocationChange = () => {
    const locationState : ILocationState = location.state || {};
    if (openBackupModal) {
      setBackupRestoreModal(false);
    } else if (locationState.displayBackResModal) {
      setBackupRestoreModal(locationState.displayBackResModal);
    }

    if (themeSelection) {
      setThemeSelection(false);
    } else if (locationState.changeTheme) {
      setThemeSelection(locationState.changeTheme);
    }
  };

  const handleBackResModal = () => { navigate(window.location.pathname, { state: { displayBackResModal: true } }); };

  const handleChangeTheme = () => { navigate("/MyGoals", { state: { ...location.state, changeTheme: true } }); };

  useEffect(() => {
    handleLocationChange();
  }, [location]);

  return {
    handleBackResModal,
    handleChangeTheme
  };
}

export default useGlobalStore;
