import React from "react";

import emptyIllustration from "@assets/images/emptySvg.svg";

const isUpdgradeAvailable = localStorage.getItem("updateAvailable") === "true";

const Empty = () => (
  <div style={{ textAlign: "center" }}>
    <img alt="Zinzen Empty" src={emptyIllustration} style={{ width: 300, height: 300 }} />
    <p>😇 It&apos;s empty today 😇
      { isUpdgradeAvailable && (
      <>
        <br />But ZinZen brought new updates for you
      </>
      )}
    </p>
  </div>

);

export default Empty;
