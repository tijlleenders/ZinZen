import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { useLocation, useNavigate } from "react-router-dom";

import { ILocationState } from "@src/Interfaces";
import { displayAddFeeling } from "@src/store/FeelingsState";

function useFeelingStore() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAddFeelingsModal, setShowAddFeelingsModal] = useRecoilState(displayAddFeeling);

  const handleLocationChange = () => {
    const locationState : ILocationState = location.state || {};
    if (showAddFeelingsModal) {
      setShowAddFeelingsModal(false);
    } else if (locationState.displayAddFeeling) {
      setShowAddFeelingsModal(locationState.displayAddFeeling);
    }
  };

  const handleAddFeeling = () => {
    navigate("/MyJournal", { state: { displayAddFeeling: true } });
  };

  useEffect(() => {
    handleLocationChange();
  }, [location]);

  return {
    handleAddFeeling
  };
}

export default useFeelingStore;
