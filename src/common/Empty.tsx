import React from "react";

import emptyIllustration from "@assets/images/emptySvg.svg";

const Empty = () => (
  <div style={{ textAlign: "center" }}>
    <img alt="Zinzen Empty" src={emptyIllustration} style={{ width: 300, height: 300 }} />
    <p>😇 It&apos;s empty today 😇</p>
  </div>

);

export default Empty;
