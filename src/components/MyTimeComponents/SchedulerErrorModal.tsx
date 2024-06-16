/* eslint-disable react/no-array-index-key */
import React from "react";
import "../index.scss";
import ZModal from "@src/common/ZModal";
import { useRecoilState } from "recoil";
import { schedulerErrorState } from "@src/store/SchedulerErrorState";

const SchedulerErrorModal = () => {
  const [schedulerErrorMessage, setSchedulerErrorMessage] = useRecoilState(schedulerErrorState);

  const handleModalClose = () => {
    setSchedulerErrorMessage([]);
  };

  return (
    <ZModal open={schedulerErrorMessage.length > 0} type="scheduleErrorModal" onCancel={handleModalClose}>
      <h1 className="popupModal-title">Scheduler Error</h1>
      {schedulerErrorMessage.map((error, index) => (
        <p key={index}>{error}</p>
      ))}
    </ZModal>
  );
};

export default SchedulerErrorModal;
