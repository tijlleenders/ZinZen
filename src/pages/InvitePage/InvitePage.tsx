import { useRecoilValue } from "recoil";
import { useNavigate } from "react-router";
import React, { useEffect, useState } from "react";

import { darkModeState } from "@src/store";
import { addContact } from "@src/api/ContactsAPI";
import { queryStyle } from "@src/constants/booleanScreen";
import { acceptRelationship } from "@src/services/contact.service";
import { LandingHeader } from "@components/HeaderDashboard/LandingHeader";

const InvitePage = () => {
  const navigate = useNavigate();
  const darkModeStatus = useRecoilValue(darkModeState);
  const [newContactName, setNewContactName] = useState("");

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const res = await acceptRelationship();
    if (res.success) {
      await addContact(newContactName, res.response?.relId, true);
      setNewContactName("");
    }
    navigate("/");
  };
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
    <form style={{ ...queryStyle.main, padding: "100px 28px 0 28px" }} onSubmit={handleSubmit}>
      <LandingHeader avatar={null} />
      <p style={{ margin: "0 0 20px 0", color: darkModeStatus ? "rgb(171, 158, 216)" : "#CD6E51" }}>
        Welcome to ZinZen!<br />
        The sender of this message want to connect with you here.
        <br />Add them to your contact list.
      </p>
      <input onChange={(e) => setNewContactName(e.target.value)} className={`default-input${darkModeStatus ? "-dark" : ""}`} placeholder="Contact name" />
      <button
        type="button"
        className={`default-btn${darkModeStatus ? "-dark" : ""}`}
        style={{ alignSelf: "right" }}
        onClick={handleSubmit}
      > Add to my contacts
      </button>
    </form>
  );
};

export default InvitePage;
