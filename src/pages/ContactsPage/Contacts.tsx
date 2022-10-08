import React, { useEffect, useState } from "react";
import { Row } from "react-bootstrap";
import { useRecoilValue } from "recoil";

import ContactItem from "@src/models/ContactItem";
import { getAllContacts } from "@src/api/ContactsAPI";
import { darkModeState } from "@src/store";
import { HeaderDashboard } from "@components/HeaderDashboard/HeaderDashboard";

import "./Contacts.scss";

const Contacts = () => {
  const darkModeStatus = useRecoilValue(darkModeState);
  const [contacts, setContacts] = useState<ContactItem[]>([]);

  const getContactBtn = (letter: string) => (
    <div className="contact-button">
      <button
        type="button"
        className="contact-icon"
      >
        {letter[0]}
      </button>
    </div>
  );

  useEffect(() => {
    (async () => {
      const tmp = await getAllContacts();
      setContacts([...tmp]);
    })();
  }, []);

  return (
    <>
      <Row>
        <HeaderDashboard />
      </Row>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="my-goals-content">
          <input
            id={darkModeStatus ? "goal-searchBar-dark" : "goal-searchBar"}
            placeholder="Search"
          />
          <div id="contact-list">
            <h1 id={darkModeStatus ? "myGoals_title-dark" : "myGoals_title"}>
              Recent Contacts
            </h1>

            {contacts.map((ele) => (
              <>
                <div
                  aria-hidden
                  key={String(`contact-${ele.id}`)}
                  className="contact-tile"
                  style={{ cursor: "pointer" }}
                >
                  {getContactBtn(ele.name)}
                  <span>
                    { ele.name}
                  </span>
                </div>
                <hr />
              </>

            ))}
          </div>
        </div>
      </div>
    </>

  );
};

export default Contacts;
