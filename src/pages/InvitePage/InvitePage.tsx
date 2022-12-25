import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useRecoilValue } from "recoil";

import { acceptRelationship, addContact } from "@src/api/ContactsAPI";
import { queryStyle } from "@src/constants/booleanScreen";
import { darkModeState } from "@src/store";
import { LandingHeader } from "@components/HeaderDashboard/LandingHeader";

const InvitePage = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [newContactName, setNewContactName] = useState("");

  useEffect(() => {
    const checkin = localStorage.getItem("checkedIn");
    if (!checkin) {
      localStorage.setItem("checkedIn", "no");
    }
    if (checkin !== "yes") {
      localStorage.setItem("pendingInvite", window.location.href.split("invite/")[1]);
      navigate("/");
    }
  }, []);
  return (
    <div style={{ ...queryStyle.main, padding: "100px 28px 0 28px" }}>
      <LandingHeader avatar={null} />
      <p style={{ margin: "0 0 20px 0", color: darkModeStatus ? "rgb(171, 158, 216)" : "#CD6E51" }}>
        Welcome to ZinZen!<br />
        The person that sent you this, wants to connect with you here.
        <br />Add them to your contacts.
      </p>
      <input onChange={(e) => setNewContactName(e.target.value)} className={`default-input${darkModeStatus ? "-dark" : ""}`} placeholder="Name" />
      <button
        type="button"
        className={`default-btn${darkModeStatus ? "-dark" : ""}`}
        style={{ alignSelf: "right" }}
        onClick={async () => {
          const res = await acceptRelationship();
          if (res.success) {
            await addContact(newContactName, res.response?.relId);
            setNewContactName("");
          }
          navigate("/");
        }}
      > Add Contact
      </button>
    </div>
  );
};

export default InvitePage;
