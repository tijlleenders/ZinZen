import { db } from "@models";
import ContactItem from "@src/models/ContactItem";
import { getJustDate } from "@src/utils";

export const getAllContacts = async () => {
  const allContacts = await db.contactsCollection.toArray();
  return allContacts;
};

export const addContact = async (contactName: string, relationshipId: string = "dummyid") => {
  const name = `${contactName.charAt(0).toUpperCase() + contactName.slice(1)}`;
  const currentDate = getJustDate(new Date());
  const newContact: ContactItem = { name, relationshipId, createdAt: currentDate };
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
