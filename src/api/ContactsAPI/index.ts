/* eslint-disable no-param-reassign */
import { db } from "@models";
import ContactItem from "@src/models/ContactItem";
import { getRelationshipStatus } from "@src/services/contact.service";
import { v4 as uuidv4 } from "uuid";

export const getAllContacts = async () => {
  const allContacts = await db.contactsCollection.toArray();
  return allContacts;
};

export const getPartnersCount = async () => {
  return db.contactsCollection.count();
};

export const addContact = async (contactName: string, relId: string, accepted = false) => {
  const name = `${contactName.charAt(0).toUpperCase() + contactName.slice(1)}`;
  const currentDate = new Date();
  const newContact: ContactItem = {
    id: uuidv4(),
    name,
    relId,
    createdAt: currentDate,
    accepted,
    goalsToBeShared: [],
  };
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

export const getContactByRelId = async (relId: string) => {
  try {
    const contact = await db.contactsCollection.where("relId").equals(relId).toArray();
    return contact[0];
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getContactGoalById = async (id: string) => {
  const goal = await db.contactsCollection.where("id").equals(id).toArray();
  return goal[0];
};

export const updateStatusOfContact = async (relId: string, accepted: boolean) => {
  db.transaction("rw", db.contactsCollection, async () => {
    await db.contactsCollection
      .where("relId")
      .equals(relId)
      .modify((obj) => {
        obj.accepted = accepted;
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const checkAndUpdateRelationshipStatus = async (relId: string) => {
  if (relId === "") {
    return false;
  }
  const res = await getRelationshipStatus(relId);
  if (res.success) {
    await updateStatusOfContact(relId, res.response.status !== "pending");
    return res.response.status !== "pending";
  }
  return false;
};

export const updateAllUnacceptedContacts = async () => {
  const allContacts = await db.contactsCollection.toArray();
  allContacts.forEach(async (ele) => {
    if (!ele.accepted) {
      checkAndUpdateRelationshipStatus(ele.relId);
    }
  });
};
