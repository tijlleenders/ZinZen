import React from "react";
import "../index.scss";
import ZModal from "@src/common/ZModal";
import { useRecoilState } from "recoil";
import { schedulerErrorModalShown, schedulerErrorState } from "@src/store/SchedulerErrorState";

const SchedulerErrorModal = () => {
  const [schedulerErrorMessage, setSchedulerErrorMessage] = useRecoilState(schedulerErrorState);
  const [showErrorModal, setShowErrorModal] = useRecoilState(schedulerErrorModalShown);

  const handleModalClose = () => {
    setSchedulerErrorMessage(null);
    setShowErrorModal(true);
  };

  if (showErrorModal) return null;

  return (
    <ZModal open={!!schedulerErrorMessage} type="scheduleErrorModal" onCancel={handleModalClose}>
      <h1 className="popupModal-title">{schedulerErrorMessage}</h1>
    </ZModal>
  );
};

export default SchedulerErrorModal;
