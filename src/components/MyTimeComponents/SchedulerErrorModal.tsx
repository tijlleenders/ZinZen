import ZModal from "@src/common/ZModal";
import React from "react";
const SchedulerErrorModal = () => {
  const [open, setOpen] = React.useState(true);
  return (
    <ZModal open={open} type="backupRestoreModal" onCancel={() => setOpen(false)} width={400}>
      <p className="popupModal-title" style={{ margin: 0 }}>
        Scheduler Error
      </p>
    </ZModal>
  );
};

export default SchedulerErrorModal;
