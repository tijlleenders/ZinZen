import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";

import { displayToast } from "@src/store";
import { addContact, getAllContacts } from "@src/api/ContactsAPI";
import { acceptRelationship } from "@src/services/contact.service";
import OnboardingLayout from "@src/layouts/OnboardingLayout";
import { displayPartnerModeTour } from "@src/store/TourState";
import { LocalStorageKeys } from "@src/constants/localStorageKeys";
import DefaultInput from "@src/common/DefaultInput";
import DefaultButton from "@src/common/DefaultButton";

const InvitePage = () => {
  const navigate = useNavigate();
  const setDisplayTour = useSetRecoilState(displayPartnerModeTour);

  const setShowToast = useSetRecoilState(displayToast);

  const [newContactName, setNewContactName] = useState("");

  const checkForTour = async () => {
    const numberOfContacts = await getAllContacts();
    if (numberOfContacts.length <= 1) {
      setDisplayTour(true);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (newContactName.trim() === "") {
      setShowToast({ open: true, message: "Please name this contact", extra: "" });
      return;
    }
    const res = await acceptRelationship();
    if (res.success && res.response?.relId) {
      const { relId } = res.response;
      await addContact(newContactName, relId, "receiver", true);
      setNewContactName("");
    }
    checkForTour();
    navigate("/");
  };

  useEffect(() => {
    const checkin = localStorage.getItem(LocalStorageKeys.CHECKED_IN);
    if (!checkin) {
      localStorage.setItem(LocalStorageKeys.CHECKED_IN, "no");
    }
    if (checkin !== "yes") {
      localStorage.setItem(LocalStorageKeys.PENDING_INVITE, window.location.href.split("invite/")[1]);
      navigate("/");
    }
  }, []);
  return (
    <OnboardingLayout>
      <p style={{ textAlign: "left", margin: "20px 0 20px 0", fontWeight: 600 }}>
        Welcome to ZinZen!
        <br />
        The sender of this message wants to connect with you here.
        <br />
        Add them to your contact list.
      </p>
      <DefaultInput
        placeholder="Contact name"
        value={newContactName}
        onChange={(e) => setNewContactName(e.target.value)}
      />
      <DefaultButton onClick={handleSubmit} customStyle={{ marginTop: "20px", alignSelf: "flex-end" }}>
        Add to my contacts
      </DefaultButton>
    </OnboardingLayout>
  );
};

export default InvitePage;
