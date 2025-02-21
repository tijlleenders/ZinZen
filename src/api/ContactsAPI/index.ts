/* eslint-disable no-param-reassign */
import { db } from "@models";
import ContactItem from "@src/models/ContactItem";
import { getRelationshipStatus } from "@src/services/contact.service";
import { v4 as uuidv4 } from "uuid";
import { deleteSharedGoal } from "@src/controllers/GoalController";
import { getAllSharedWMGoalByPartner } from "../SharedWMAPI";
import { getAllGoals } from "../GoalsAPI";

export const getAllContacts = async () => {
  return db.contactsCollection.toArray();
};

export const getPartnersCount = async () => {
  return db.contactsCollection.count();
};

export const getPartnerById = async (id: string) => {
  return db.contactsCollection.get(id);
};

export const addContact = async (contactName: string, relId: string, type: string, accepted = false) => {
  const name = `${contactName.charAt(0).toUpperCase() + contactName.slice(1)}`;
  const currentDate = new Date();
  const newContact: ContactItem = {
    id: uuidv4(),
    name,
    relId,
    createdAt: currentDate,
    accepted,
    goalsToBeShared: [],
    type,
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

const removeContactFromGoalParticipants = async (relId: string) => {
  const goals = await getAllGoals();
  const goalsWithContact = goals.filter((goal) => goal.participants.some((participant) => participant.relId === relId));

  await Promise.all(
    goalsWithContact.map((goal) => {
      goal.participants = goal.participants.filter((participant) => participant.relId !== relId);
      return db.goalsCollection.put(goal);
    }),
  );
};

export const deleteContact = async (contactId: string) => {
  try {
    const contact = await getPartnerById(contactId);
    if (!contact) {
      return {
        success: false,
        message: "Contact not found",
      };
    }
    const partnerGoals = await getAllSharedWMGoalByPartner(contact.relId);

    // Await all delete operations
    await Promise.all(partnerGoals.map((goal) => deleteSharedGoal(goal)));

    // remove contact from colaborated goal's participants
    await removeContactFromGoalParticipants(contact.relId);

    // delete contact from contacts collection
    await db.contactsCollection.delete(contact.id);
    return {
      success: true,
      message: "Contact deleted successfully",
    };
  } catch (err) {
    console.log(err);
    return {
      success: false,
      message: "Failed to delete contact",
    };
  }
};

export const updateContact = async (contact: ContactItem) => {
  try {
    const updatedContact = await db.contactsCollection.put(contact);
    return updatedContact;
  } catch (err) {
    console.log(err);
    throw err;
  }
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

export const updateAllUnacceptedContacts = async (): Promise<ContactItem[]> => {
  const allContacts = await db.contactsCollection.toArray();
  const results = await Promise.allSettled(
    allContacts
      .filter((contact) => !contact.accepted)
      .map(async (contact) => {
        const res = await checkAndUpdateRelationshipStatus(contact.relId);
        return res ? contact : null;
      }),
  );

  return results
    .filter(
      (result): result is { status: "fulfilled"; value: ContactItem | null } =>
        result.status === "fulfilled" && !!result.value,
    )
    .map(({ value }) => value as ContactItem);
};

export const addToSharingQueue = async (relId: string, goalId: string) => {
  db.transaction("rw", db.contactsCollection, async () => {
    await db.contactsCollection
      .where("relId")
      .equals(relId)
      .modify((obj) => {
        if (!obj.goalsToBeShared.includes(goalId)) {
          obj.goalsToBeShared.push(goalId);
        }
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};

export const clearTheQueue = async (relId: string) => {
  db.transaction("rw", db.contactsCollection, async () => {
    await db.contactsCollection
      .where("relId")
      .equals(relId)
      .modify((obj) => {
        obj.goalsToBeShared = [];
      });
  }).catch((e) => {
    console.log(e.stack || e);
  });
};
