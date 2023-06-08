/* eslint-disable react/require-default-props */
import React from "react";

import emptyIllustration from "@assets/images/emptySvg.svg";

interface EmptyProps {
  subText?: string
}

const Empty: React.FC<EmptyProps> = ({ subText }) => (
  <div style={{ textAlign: "center" }}>
    <img alt="Zinzen Empty" src={emptyIllustration} style={{ width: 300, height: 300 }} />
    <p>😇 It&apos;s empty today 😇
      { subText && (
      <>
        <br />{subText}
      </>
      )}
    </p>
  </div>

);

export default Empty;
