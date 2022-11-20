import React from "react";
import { Offcanvas } from "react-bootstrap";
import { useRecoilState, useRecoilValue } from "recoil";

import { displaySidebar } from "@src/store/SidebarState";
import { darkModeState } from "@src/store";
import { useNavigate } from "react-router";
import { LandingHeader } from "./HeaderDashboard/LandingHeader";

const navButtonStyle = {
  border: "none",
  marginTop: "1.5em",
  width: "200px",
  borderRadius: "8px",
  padding: "5px 20px",
  fontWeight: "bolder",
  fontSize: "1.5em",
  color: "black",
  backgroundColor: "#EDC7B7",
};
const darkNavBtn = {
  color: "white",
  background: "rgba(112, 112, 112, 0.4)"
};

const Sidebar = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [showSidebar, setShowSidebar] = useRecoilState(displaySidebar);

  const getNavButton = (text: string, to = "/") => (
    <button
      type="button"
      style={{
        ...navButtonStyle,
        ...(darkModeStatus ? darkNavBtn : {}) }}
      onClick={() => {
        setShowSidebar(false);
        if (to.includes("http")) window.open(to, "_self");
        else navigate(to);
      }}
    >
      {text}
    </button>
  );
  return (

    <Offcanvas
      show={showSidebar}
      onHide={() => setShowSidebar(false)}
      className={darkModeStatus ? "App-dark" : "App-light"}
      style={{ width: "65vw" }}
    >
      <Offcanvas.Header>
        <Offcanvas.Title>
          <LandingHeader avatar={null} />
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <div style={{ display: "flex", flexDirection: "column", marginTop: "4vh", alignItems: "center" }}>
          { getNavButton("Blog", "https://blog.zinzen.me/") }
          { getNavButton("Donate", "https://donate.stripe.com/6oE4jK1iPcPT1m89AA") }
          { getNavButton("Feedback", "/ZinZen/Feedback") }
          { getNavButton("Privacy", "/ZinZenFAQ") }
        </div>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default Sidebar;
