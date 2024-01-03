import React, { useState } from "react";
import { Switch } from "antd";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

import TickIcon from "@assets/images/correct.svg";

const HintToggle = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [hints, setHints] = useState(false);

  return (
    <div className="hint-toggle">
      <p style={{ marginTop: 6 }}>Hints</p>
      <Switch
        prefixCls={`ant-switch${darkModeStatus ? "-dark" : ""}`}
        checkedChildren={<img src={TickIcon} alt="Tick icon" />}
        defaultChecked={hints}
        onChange={(value) => setHints(!value)}
      />
    </div>
  );
};

export default HintToggle;
