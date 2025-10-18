// TODO: move rendering of modal to the url path
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "@tanstack/react-router";

import { ILocationState } from "@src/Interfaces";
import { displayAddFeeling } from "@src/store/FeelingsState";

function useFeelingStore() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAddFeelingsModal, setShowAddFeelingsModal] = useRecoilState(displayAddFeeling);

  const handleLocationChange = () => {
    const locationState: ILocationState = location.state || {};
    if (showAddFeelingsModal) {
      setShowAddFeelingsModal(false);
    } else if (locationState.displayAddFeeling) {
      setShowAddFeelingsModal(locationState.displayAddFeeling);
    }
  };

  const handleAddFeeling = () => {
    navigate({ to: "/MyJournal", state: { displayAddFeeling: true } });
  };

  useEffect(() => {
    if (location && location.pathname === "/MyJournal") {
      handleLocationChange();
    }
  }, [location]);

  return {
    handleAddFeeling,
  };
}

export default useFeelingStore;
