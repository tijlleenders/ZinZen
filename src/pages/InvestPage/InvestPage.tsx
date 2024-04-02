import React from "react";
import { darkModeState } from "@src/store";
import { useRecoilValue } from "recoil";

import download from "@assets/images/download.svg";

import "./InvestPage.scss";
import OnboardingLayout from "@src/layouts/OnboardingLayout";

const InvestPage = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  return (
    <OnboardingLayout>
      <div id="invest-container">
        <p>
          <span>ZinZen</span> is a <span>social life planner.</span>
        </p>
        <p>You write down your life goals and share them with others - or pseudo anonymously.</p>
        <p>The tips you get back can be scheduled on your calendar - with one click!</p>
        <p>
          <span>Harvard Business Review says it&apos;s worth billions!</span>
        </p>
        <p>The app is free for people.</p>
        <p>
          We <span>charge companies</span> to publish company goals and get honest real-time feedback from passionate
          employees with balanced lives.
        </p>
        <p>In a few months, with four people, part-time and fully remote,</p>
        <p>
          {" "}
          <span>we built an MVP, </span>
        </p>
        <p>
          {" "}
          <span>got media attention, </span>
        </p>
        <p>
          {" "}
          <span>and a big launching customer. </span>
        </p>

        <p>In the battle with big tech - we will win. We&apos;ve designed for it. </p>
        <p>
          <span>A platform like ZinZen requires trust,</span>
        </p>
        <p>trust that best comes from an open, not-for-profit, privacy-friendly team. </p>

        <p>What open source has done for software, </p>
        <p>
          ZinZen will do for <span> human purpose. </span>{" "}
        </p>

        <p>We offer debt-financing </p>
        <p>and 200k will get us to default-alive within a year. </p>
        <button
          type="button"
          style={{ fontSize: "14px", marginBottom: "5px" }}
          onClick={() =>
            window.open(
              "https://drive.google.com/u/0/uc?id=1w158k7GF9GyKDPkE--Zv7tgzSORfjXwQ&export=download",
              "_blank",
            )
          }
          className={`default-btn${darkModeStatus ? "-dark" : ""}`}
        >
          <img alt="download zinzen pitch" src={download} className={darkModeStatus ? "dark-svg" : ""} />
          Download ZinZen pitch deck
        </button>
      </div>
    </OnboardingLayout>
  );
};

export default InvestPage;
