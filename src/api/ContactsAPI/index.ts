import { db } from "@models";
import ContactItem from "@src/models/ContactItem";
import { getJustDate } from "@src/utils";

export const initRelationship = async () => {
  try {
    const installId = localStorage.getItem("installId");
    const res = await fetch("https://gyya537jwynoda4z46nyykeevu0msejw.lambda-url.eu-west-1.on.aws/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method: "initiateRelationship", installId }),
    });
    const { relId } = await res.json();
    return { success: res.ok, response: { installId, relId } };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
};

export const acceptRelationship = async () => {
  const relId = window.location.pathname.split("/invite/")[1];
  try {
    const installId = localStorage.getItem("installId");
    const res = await fetch("https://gyya537jwynoda4z46nyykeevu0msejw.lambda-url.eu-west-1.on.aws/", {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ method: "acceptRelationship", installId, relId }),
    });
    return { success: res.ok, response: (await res.json()).status };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
};

export const getAllContacts = async () => {
  const allContacts = await db.contactsCollection.toArray();
  return allContacts;
};

export const addContact = async (contactName: string, relId: string, installId: string) => {
  const name = `${contactName.charAt(0).toUpperCase() + contactName.slice(1)}`;
  const currentDate = getJustDate(new Date());
  const newContact: ContactItem = { name, relId, installId, createdAt: currentDate };
  let newContactId;
  await db
    .transaction("rw", db.contactsCollection, async () => {
      newContactId = await db.contactsCollection.add(newContact);
    })
    .catch((e) => {
      console.log(e.stack || e);
    });
  return newContactId;
};
