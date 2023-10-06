import BottomNavLayout from "@src/layouts/BottomNavLayout";
import ContactItem from "@src/models/ContactItem";
import React from "react";

const ParticipantsNavbar = ({
  list,
  activePartner,
  setActivePartner,
}: {
  list: ContactItem[];
  setActivePartner: React.Dispatch<React.SetStateAction<string>>;
  activePartner: string;
}) => {
  return (
    <BottomNavLayout>
      {list.map((contact) => (
        <button
          key={contact.relId}
          type="button"
          onClick={() => {
            setActivePartner(contact.relId);
          }}
          className={`bottom-nav-item ${activePartner === contact.relId ? "active" : ""}`}
        >
          <p>{contact.name}</p>
        </button>
      ))}
    </BottomNavLayout>
  );
};

export default ParticipantsNavbar;
