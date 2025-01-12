import React from "react";

import ignore from "@assets/images/ignore.svg";

import DefaultButton from "@src/common/DefaultButton";

interface IgnoreBtnProps {
  deleteChanges: () => Promise<void>;
}
const IgnoreBtn = ({ deleteChanges }: IgnoreBtnProps) => {
  return (
    <DefaultButton variant="secondary" onClick={deleteChanges}>
      <img alt="add changes" src={ignore} width={25} />
      Ignore all
    </DefaultButton>
  );
};

export default IgnoreBtn;
