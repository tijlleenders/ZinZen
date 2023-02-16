import { useRecoilValue } from "recoil";
import React, { useEffect, useState } from "react";

import { darkModeState } from "@src/store";
import ContactItem from "@src/models/ContactItem";
import { getAllContacts } from "@src/api/ContactsAPI";
import { MainHeaderDashboard } from "@components/HeaderDashboard/MainHeaderDashboard";

import "./Contacts.scss";
import "@pages/MyGoalsPage/MyGoalsPage.scss";

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
      <MainHeaderDashboard />
      <div id="my-contacts">
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
    </>

  );
};

export default Contacts;
