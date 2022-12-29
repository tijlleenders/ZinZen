/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
import { db } from "@models";
import ContactItem from "@src/models/ContactItem";
import { GoalItem } from "@src/models/GoalItem";
import { getJustDate } from "@src/utils";
import { v4 as uuidv4 } from "uuid";

const installId = localStorage.getItem("installId");

const createRequest = async (url: string, body : object | null = null, method = "POST") => {
  try {
    const res = await fetch(url, {
      method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body || {})
    });
    return { success: res.ok, response: await res.json() };
  } catch (err) {
    return {
      success: false,
      message: "Aww... So sorry something went wrong. Try again later",
    };
  }
};
export const initRelationship = async () => {
  const url = "https://7i76q5jdugdvmk7fycy3owyxce0wdlqv.lambda-url.eu-west-1.on.aws/";

  const res = await createRequest(url, { method: "initiateRelationship", installId });
  if (res.success) {
    const { relId } = res.response;
    return { success: true, response: { installId, relId } };
  }
  return res;
};

export const acceptRelationship = async () => {
  const _installId = localStorage.getItem("installId");
  const relId = window.location.pathname.split("/invite/")[1];
  const url = "https://7i76q5jdugdvmk7fycy3owyxce0wdlqv.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "acceptRelationship", installId: _installId, relId });
  return res;
};

export const shareGoalWithContact = async (relId: string, goal: { id: string, title: string }) => {
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "shareGoal", installId, relId, event: { type: "shareGoal", goal } });
  return res;
};

export const collaborateWithContact = async (relId: string, goal: GoalItem) => {
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "shareGoal", installId, relId, event: { type: "collaboration", goal } });
  return res;
};

export const sendResponseOfColabInvite = async (status: string, relId: string, goalId: string) => {
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "shareGoal", installId, relId, event: { type: "colabInviteResponse", goalId, status } });
  return res;
};

export const getContactSharedGoals = async () => {
  const url = "https://j6hf6i4ia5lpkutkhdkmhpyf4q0ueufu.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "getGoals", installId });
  return res;
};

export const getRelationshipStatus = async (relationshipId: string) => {
  const url = "https://7i76q5jdugdvmk7fycy3owyxce0wdlqv.lambda-url.eu-west-1.on.aws/";
  const res = await createRequest(url, { method: "getRelationshipStatus", installId, relationshipId });
  return res;
};

export const getAllContacts = async () => {
  const allContacts = await db.contactsCollection.toArray();
  return allContacts;
};

export const addContact = async (contactName: string, relId: string, accepted = false) => {
  const name = `${contactName.charAt(0).toUpperCase() + contactName.slice(1)}`;
  const currentDate = getJustDate(new Date());
  const newContact: ContactItem = { id: uuidv4(), name, relId, sharedGoals: [], collaborativeGoals: [], createdAt: currentDate, accepted };
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

export const addSharedGoalsInRelId = async (relId: string, goals:{ id: string, goal: GoalItem }[]) => {
  db.transaction("rw", db.contactsCollection, async () => {
    await db.contactsCollection.where("relId").equals(relId)
      .modify({ sharedGoals: [...goals] });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const addColabInvitesInRelId = async (relId: string, goals:{ id: string, goal: GoalItem }[]) => {
  db.transaction("rw", db.contactsCollection, async () => {
    await db.contactsCollection.where("relId").equals(relId)
      .modify({ collaborativeGoals: [...goals] });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const removeGoalInRelId = async (relId: string, goalId: string) => {
  db.transaction("rw", db.contactsCollection, async () => {
    await db.contactsCollection.where("relId").equals(relId)
      .modify((obj: ContactItem) => {
        const tmp = obj.sharedGoals.filter((ele) => ele.id !== goalId);
        obj.sharedGoals = [...tmp];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const getAllSharedGoals = async () => {
  const contacts = await db.contactsCollection.toArray();
  return contacts;
};

export const updateStatusOfContact = async (relId: string, accepted: boolean) => {
  db.transaction("rw", db.contactsCollection, async () => {
    await db.contactsCollection.where("relId").equals(relId)
      .modify((obj) => { obj.accepted = accepted; });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
