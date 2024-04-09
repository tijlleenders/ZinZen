import React from "react";
import { Switch } from "antd";
import { useRecoilValue } from "recoil";
import { darkModeState } from "@src/store";

import TickIcon from "@assets/images/correct.svg";

const HintToggle = ({
  defaultValue,
  setHints,
}: {
  defaultValue: boolean;
  setHints: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const darkModeStatus = useRecoilValue(darkModeState);

  return (
    <div className="hint-toggle">
      <p style={{ marginTop: 6 }}>Hints</p>
      <Switch
        prefixCls={`ant-switch${darkModeStatus ? "-dark" : ""}`}
        checkedChildren={<img src={TickIcon} alt="Tick icon" />}
        checked={defaultValue}
        onChange={(value) => (value === true ? setHints(true) : setHints(false))}
      />
    </div>
  );
};

export default HintToggle;
