import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { ILocationState } from "@src/Interfaces";
import { backupRestoreModal, languageChangeModal } from "@src/store";

function useGlobalStore() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openBackupModal, setBackupRestoreModal] = useRecoilState(backupRestoreModal);
  const [langChangeModal, setLangChangeModal] = useRecoilState(languageChangeModal);

  const handleLocationChange = () => {
    const locationState: ILocationState = location.state || {};
    if (openBackupModal) {
      setBackupRestoreModal(false);
    } else if (locationState.displayBackResModal) {
      setBackupRestoreModal(locationState.displayBackResModal);
    }

    if (langChangeModal) {
      setLangChangeModal(false);
    } else if (locationState.displayLangChangeModal) {
      setLangChangeModal(locationState.displayLangChangeModal);
    }
  };

  const handleBackResModal = () => {
    navigate({ to: window.location.pathname, state: { displayBackResModal: true } });
  };

  const handleBackLangModal = () => {
    navigate({ to: window.location.pathname, state: { displayLangChangeModal: true } });
  };

  const handleLangChangeModal = () => {
    if (langChangeModal) {
      setLangChangeModal(false);
    } else {
      setLangChangeModal(!langChangeModal);
    }
  };

  useEffect(() => {
    handleLocationChange();
  }, [location]);

  return {
    handleBackResModal,
    handleLangChangeModal,
    handleBackLangModal,
  };
}

export default useGlobalStore;
