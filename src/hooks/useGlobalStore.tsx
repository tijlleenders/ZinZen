import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";

import { ILocationState } from "@src/Interfaces";
import { backupRestoreModal } from "@src/store";

function useGlobalStore() {
  const location = useLocation();
  const navigate = useNavigate();
  const [openBackupModal, setBackupRestoreModal] = useRecoilState(backupRestoreModal);

  const handleLocationChange = () => {
    const locationState : ILocationState = location.state || {};
    if (openBackupModal) {
      setBackupRestoreModal(false);
    } else if (locationState.displayBackResModal) {
      setBackupRestoreModal(locationState.displayBackResModal);
    }
  };

  const handleBackResModal = () => { navigate(window.location.pathname, { state: { displayBackResModal: true } }); };

  useEffect(() => {
    handleLocationChange();
  }, [location]);

  return {
    handleBackResModal
  };
}

export default useGlobalStore;
